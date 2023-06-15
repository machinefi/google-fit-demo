import { NextResponse } from "next/server";

import { triggerEvaluation } from "@/features/fitness-data/services/w3bstream/client";

export async function POST() {
  try {
    await triggerEvaluation();
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.response.data.error || e.message || "Unknown error" },
      { status: 500 }
    );
  }
}
