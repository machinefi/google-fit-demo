import { NextRequest, NextResponse } from "next/server";

import { hashString as hashEmail } from "@/features/secrets/utils/hash";
import { registerDevice } from "@/features/web3/services/viem/registrationContract";
import { bindDevice } from "@/features/web3/services/viem/bindingContract";

export async function POST(req: NextRequest) {
  const { ownerEmail, ownerAddr } = await req.json();

  if (!ownerEmail || !ownerAddr) {
    return NextResponse.json(
      { error: "Not valid credentials" },
      { status: 401 }
    );
  }

  try {
    const emailHashed = hashEmail(ownerEmail);

    const { registerTx, bindTx } = await registerOnChain(
      emailHashed,
      ownerAddr
    );
    return NextResponse.json({
      success: true,
      registerTx,
      bindTx,
      emailHashed: "0x" + emailHashed,
    });
  } catch (e: any) {
    console.log(e);
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}

async function registerOnChain(deviceId: string, ownerAddr: string) {
  try {
    const registerTx = await registerDevice([`0x${deviceId}`]);
    const bindTx = await bindDevice([`0x${deviceId}`], ownerAddr);
    return {
      registerTx: registerTx.transactionHash,
      bindTx: bindTx.transactionHash,
    };
  } catch (error) {
    throw error;
  }
}
