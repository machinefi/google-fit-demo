import { GetDataByRID, JSON, ExecSQL } from "@w3bstream/wasm-sdk";
import { String } from "@w3bstream/wasm-sdk/assembly/sql";
import { getField, getPayloadValue } from "../utils/payload-parser";

const SESSIONS_TABLE = "training_sessions";

export function handle_receive_data(rid: i32): i32 {
  const deviceMessage = GetDataByRID(rid);
  const payload = getPayloadValue(deviceMessage);

  const deviceId = getDeviceId(payload);
  const sessions = getSessions(payload);

  handleSessions(deviceId, sessions);
  return 0;
}

function getDeviceId(payload: JSON.Obj): string {
  const deviceId = getField<JSON.Str>(payload, "deviceId");
  if (deviceId == null) {
    assert(false, "Device ID not found in payload");
  }

  return deviceId!.toString();
}

function getSessions(payload: JSON.Obj): JSON.Value[] {
  const sessions = getField<JSON.Arr>(payload, "data");
  if (sessions == null) {
    assert(false, "Sessions not found in payload");
  }

  return sessions!.valueOf();
}

export function handleSessions(deviceId: string, sessions: JSON.Value[]): void {
  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i];
    const id = getSessionId(session as JSON.Obj);
    const startTime = getTimeValue(session as JSON.Obj, "startTimeMillis");
    const endTime = getTimeValue(session as JSON.Obj, "endTimeMillis");
    storeSession(deviceId, id, startTime, endTime);
  }
}

function getSessionId(session: JSON.Obj): string {
  const id = getField<JSON.Str>(session, "id");
  if (id == null) {
    assert(false, "Session ID not found in payload");
  }

  return id!.toString();
}

function getTimeValue(session: JSON.Obj, timeName: string): string {
  const timeValue = getField<JSON.Str>(session, timeName);

  if (timeValue == null) {
    assert(false, "Time value not found in payload");
  }

  return timeValue!.toString();
}

function storeSession(
  deviceId: string,
  sessionId: string,
  startTime: string,
  endTime: string
): void {
  const sql = `INSERT INTO "${SESSIONS_TABLE}" (device_id, session_id, start_time_millis, end_time_millis) VALUES (?,?,?,?);`;
  ExecSQL(sql, [
    new String(deviceId),
    new String(sessionId),
    new String(startTime),
    new String(endTime),
  ]);
}
