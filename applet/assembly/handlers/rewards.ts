import { GetEnv, JSON, Log, QuerySQL, SendTx } from "@w3bstream/wasm-sdk";
import { String } from "@w3bstream/wasm-sdk/assembly/sql";

import { getField } from "../utils/payload-parser";
import {
  buildUINT256Slot,
  buildRecepientSlot,
  buildTxString,
} from "../utils/build-tx";

const DEVICE_REGISTRY_TABLE = "devices_registry";
const SCORES_TABLE = "sleep_scores";
const DEVICE_BINDING_TABLE = "device_binding";

const EVALUATION_PERIOD_DAYS = 7;

const APPROVE_FUNCTION_ADDR = "426a8493";

export function handle_evaluate_sleep(rid: i32): i32 {
  const averagesByDevice = getAverages();
  processAverages(averagesByDevice);
  return 0;
}

function getAverages(): JSON.Value[] {
  const queryRes = queryWeeklyAverages();
  const averages = parseWeeklyAverages(queryRes);
  return averages;
}

function queryWeeklyAverages(): string {
  const sql = `
    SELECT device_id, AVG(score_value) as average_score
    FROM ${SCORES_TABLE}
    WHERE timestamp >= NOW() - INTERVAL '${EVALUATION_PERIOD_DAYS} days'
    GROUP BY device_id;
  `;

  return QuerySQL(sql);
}

function parseWeeklyAverages(result: string): JSON.Value[] {
  const averagesRaw = JSON.parse(result);

  if (!averagesRaw.isArr) {
    const avaragesArr: JSON.Arr = new JSON.Arr();
    avaragesArr.push(averagesRaw);
    return avaragesArr.valueOf();
  } else if (averagesRaw.isArr) {
    const averagesArr = averagesRaw as JSON.Arr;
    const averages = averagesArr.valueOf();
    return averages;
  } else {
    assert(false, "Averages are not an array");
    return [];
  }
}

function processAverages(averages: JSON.Value[]): void {
  for (let i = 0; i < averages.length; i++) {
    const average = averages[i] as JSON.Obj;
    Log("Processing average: " + average.toString());
    processSingleAvearage(average);
  }
}

function processSingleAvearage(average: JSON.Obj): void {
  const deviceId = getField<JSON.Str>(average, "device_id")!.valueOf();
  const averageScore = average.get("average_score") as JSON.Value;
  let toMint: i32 = 0;

  if (averageScore instanceof JSON.Integer) {
    const avg = averageScore as JSON.Integer;
    toMint = evaluateAvg(f64(avg.valueOf()));
  } else if (averageScore instanceof JSON.Float) {
    const avg = averageScore as JSON.Float;
    toMint = evaluateAvg(avg.valueOf());
  } else {
    assert(false, "Average score is not a number");
  }

  if (toMint > 0 && checkDeviceRegistrationAndActivity(deviceId)) {
    const ownerAddr = getOwnerAddr(deviceId);
    approveSleeprNFT(ownerAddr, toMint as number);
  }
}

function evaluateAvg(avg: f64): i32 {
  if (avg > 95) {
    return 3; // Platinum
  } else if (avg > 90) {
    return 2; // Gold
  } else if (avg > 80) {
    return 1; // Silver
  } else {
    return 0;
  }
}

function checkDeviceRegistrationAndActivity(deviceId: string): bool {
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
  const sql = `SELECT owner_address FROM ${DEVICE_BINDING_TABLE} WHERE device_id = ?;`;
  const ownerAddrData = QuerySQL(sql, [new String(deviceId)]);

  let ownerAddrDataJSON = JSON.parse(ownerAddrData) as JSON.Obj;
  let ownerAddr = getField<JSON.Str>(
    ownerAddrDataJSON,
    "owner_address"
  )!.toString();

  return ownerAddr;
}

function approveSleeprNFT(to: string, type: number): void {
  const txData = buildTxData(APPROVE_FUNCTION_ADDR, to, type, 1);
  const SLEEPR_CONTRACT_ADDRESS = GetEnv("SLEEPR_CONTRACT_ADDRESS");
  const CHAIN_ID = GetEnv("CHAIN_ID");
  SendTx(parseInt(CHAIN_ID), SLEEPR_CONTRACT_ADDRESS, "0", txData);
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
