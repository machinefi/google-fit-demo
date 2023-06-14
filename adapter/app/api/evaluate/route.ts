import { NextRequest, NextResponse } from "next/server";

import { triggerEvaluation } from "@/features/sleep-data/services/w3bstream/client";

export async function POST(req: NextRequest) {
  try {
    await triggerEvaluation();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
