import { GetEnv, JSON, Log, QuerySQL, SendTx } from "@w3bstream/wasm-sdk";
import { String } from "@w3bstream/wasm-sdk/assembly/sql";

import { getField } from "../utils/payload-parser";
import {
  buildUINT256Slot,
  buildRecepientSlot,
  buildTxString,
} from "../utils/build-tx";

const APPROVE_FUNCTION_ADDR = "426a8493";

export function handle_analyze_data(rid: i32): i32 {
  const sessionCounts = getSessionsCount();
  processCounts(sessionCounts);
  cleanDB();
  return 0;
}

function getSessionsCount(): JSON.Value[] {
  const queryRes = querySessionCounts();
  const counts = parseSessionCounts(queryRes);
  return counts;
}

function querySessionCounts(): string {
  const TRAINING_SESSIONS_TABLE = GetEnv("TRAINING_SESSIONS_TABLE");
  const EVALUATION_PERIOD_DAYS = GetEnv("EVALUATION_PERIOD_DAYS");
  const SESSION_DURATION_MILLIS = GetEnv("SESSION_DURATION_MILLIS");
  
  const sql = `
    SELECT device_id, COUNT(*) as sessions_count
    FROM ${TRAINING_SESSIONS_TABLE}
    WHERE (end_time_millis - start_time_millis) > ${SESSION_DURATION_MILLIS}
    AND start_time_millis > EXTRACT(EPOCH FROM NOW() - INTERVAL '${EVALUATION_PERIOD_DAYS} days') * 1000
    GROUP BY device_id;
  `;
  return QuerySQL(sql);
}

function parseSessionCounts(result: string): JSON.Value[] {
  const countsRaw = JSON.parse(result);

  if (!countsRaw.isArr) {
    const countsArr: JSON.Arr = new JSON.Arr();
    countsArr.push(countsRaw);
    return countsArr.valueOf();
  } else if (countsRaw.isArr) {
    const countsArr = countsRaw as JSON.Arr;
    const counts = countsArr.valueOf();
    return counts;
  } else {
    assert(false, "Counts are not an array");
    return [];
  }
}

function processCounts(counts: JSON.Value[]): void {
  Log("Processing counts: " + counts.toString());
  for (let i = 0; i < counts.length; i++) {
    const count = counts[i] as JSON.Obj;
    Log("Processing count: " + count.toString());
    processSingleCount(count);
  }
}

function processSingleCount(count: JSON.Obj): void {
  const deviceId = getField<JSON.Str>(count, "device_id")!.valueOf();
  const sessionsCount = count.get("sessions_count") as JSON.Integer;

  if (
    sessionsCount.valueOf() > 0 &&
    checkDeviceRegistrationAndActivity(deviceId)
  ) {
    const ownerAddr = getOwnerAddr(deviceId);
    approveRewardsNFT(ownerAddr, f64(sessionsCount.valueOf()));
  }
}

function checkDeviceRegistrationAndActivity(deviceId: string): bool {
  const DEVICE_REGISTRY_TABLE = GetEnv("DEVICE_REGISTRY_TABLE");
  const sql = `SELECT is_registered, is_active FROM ${DEVICE_REGISTRY_TABLE} WHERE device_id = ?;`;
  const deviceData = QuerySQL(sql, [new String(deviceId)]);

  if (deviceData == null || deviceData == "") {
    return false;
  }

  let deviceDataJSON = JSON.parse(deviceData) as JSON.Obj;
  let isRegistered = getField<JSON.Bool>(
    deviceDataJSON,
    "is_registered"
  )!.valueOf();
  let isActive = getField<JSON.Bool>(deviceDataJSON, "is_active")!.valueOf();

  return isRegistered && isActive;
}

function getOwnerAddr(deviceId: string): string {
  const DEVICE_BINDING_TABLE = GetEnv("DEVICE_BINDING_TABLE");
  const sql = `SELECT owner_address FROM ${DEVICE_BINDING_TABLE} WHERE device_id = ?;`;
  const ownerAddrData = QuerySQL(sql, [new String(deviceId)]);

  let ownerAddrDataJSON = JSON.parse(ownerAddrData) as JSON.Obj;
  let ownerAddr = getField<JSON.Str>(
    ownerAddrDataJSON,
    "owner_address"
  )!.toString();

  return ownerAddr;
}

function approveRewardsNFT(to: string, amount: number): void {
  const txData = buildTxData(APPROVE_FUNCTION_ADDR, to, 1, amount);
  const REWARDS_CONTRACT_ADDRESS = GetEnv("REWARDS_CONTRACT_ADDRESS");
  const CHAIN_ID = GetEnv("CHAIN_ID");
  SendTx(i32(parseInt(CHAIN_ID)), REWARDS_CONTRACT_ADDRESS, "0", txData);
}

function buildTxData(
  functionAddr: string,
  recipient: string,
  tierId: number,
  amount: number
): string {
  const slotForRecipient = buildRecepientSlot(recipient);
  const slotForTierId = buildUINT256Slot(u64(tierId));
  const slotForAmount = buildUINT256Slot(u64(amount));

  return buildTxString([
    functionAddr,
    slotForRecipient,
    slotForTierId,
    slotForAmount,
  ]);
}

function cleanDB(): void {
  const TRAINING_SESSIONS_TABLE = GetEnv("TRAINING_SESSIONS_TABLE");
  const sql = `
    DELETE FROM ${TRAINING_SESSIONS_TABLE}
  `;
  QuerySQL(sql);
}