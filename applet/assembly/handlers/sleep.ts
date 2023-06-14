import { GetDataByRID, JSON, ExecSQL } from "@w3bstream/wasm-sdk";
import { Float64, String, Time } from "@w3bstream/wasm-sdk/assembly/sql";
import { getField, getPayloadValue } from "../utils/payload-parser";

const SCORES_TABLE = "sleep_scores";

export function handle_sleep_scores(rid: i32): i32 {
  const deviceMessage = GetDataByRID(rid);
  const payload = getPayloadValue(deviceMessage);

  const deviceId = getDeviceId(payload);
  const scores = getScores(payload);

  handleScores(deviceId, scores);
  return 0;
}

function getDeviceId(payload: JSON.Obj): string {
  const deviceId = getField<JSON.Str>(payload, "deviceId");
  if (deviceId == null) {
    assert(false, "Device ID not found in payload");
  }

  return deviceId!.toString();
}

function getScores(payload: JSON.Obj): JSON.Value[] {
  const scores = getField<JSON.Arr>(payload, "data");
  if (scores == null) {
    assert(false, "Scores not found in payload");
  }

  return scores!.valueOf();
}

export function handleScores(deviceId: string, scores: JSON.Value[]): void {
  for (let i = 0; i < scores.length; i++) {
    const score = scores[i];
    const id = getScoreId(score as JSON.Obj);
    const scoreValue = getScoreValue(score as JSON.Obj);
    const timestamp = getScoreTimestamp(score as JSON.Obj);
    storeScore(deviceId, id, scoreValue, timestamp);
  }
}

function getScoreId(score: JSON.Obj): string {
  const id = getField<JSON.Str>(score, "id");
  if (id == null) {
    assert(false, "Score ID not found in payload");
  }

  return id!.toString();
}

function getScoreValue(score: JSON.Obj): number {
  const scoreValue = score.get("score");

  if (scoreValue == null) {
    assert(false, "Score value not found in payload");
  }

  if (scoreValue instanceof JSON.Integer) {
    const score = scoreValue as JSON.Integer;
    return f64(score.valueOf());
  } else if (scoreValue instanceof JSON.Float) {
    const score = scoreValue as JSON.Float;
    return score.valueOf();
  } else {
    assert(false, "Score value is not a number");
    return 0;
  }
}

function getScoreTimestamp(score: JSON.Obj): string {
  const timestamp = getField<JSON.Str>(score, "timestamp");
  if (timestamp == null) {
    assert(false, "Score timestamp not found in payload");
  }

  return timestamp!.toString();
}

function storeScore(
  deviceId: string,
  scoreId: string,
  scoreValue: number,
  timestamp: string
): void {
  const sql = `INSERT INTO "${SCORES_TABLE}" (device_id, score_id, score_value, timestamp) VALUES (?,?,?,?);`;
  ExecSQL(sql, [
    new String(deviceId),
    new String(scoreId),
    new Float64(scoreValue),
    new Time(timestamp),
  ]);
}
