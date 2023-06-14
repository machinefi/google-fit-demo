import { NextRequest, NextResponse } from "next/server";

import { store } from "../../../features/secrets/services/redis/store";
import { encrypt as encryptOuraToken } from "../../../features/secrets/utils/encryption";
import { hashString as hashEmail } from "@/features/secrets/utils/hash";
import { registerDevice } from "@/features/web3/services/viem/registrationContract";
import { bindDevice } from "@/features/web3/services/viem/bindingContract";
import { fetchUserEmail } from "@/features/sleep-data/services/oura/get-profile";
import { EncryptedToken } from "@/features/secrets/types/EncryptedToken";

export async function POST(req: NextRequest) {
  const { ouraToken, ownerAddr } = await req.json();

  if (!ouraToken || String(ouraToken).trim() === "") {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const email = await fetchUserEmail(ouraToken);
    const emailHashed = hashEmail(email);
    const encryptedObj = encryptOuraToken(ouraToken);
    await storeDeviceInRedis(emailHashed, encryptedObj);

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

async function storeDeviceInRedis(
  emailHashed: string,
  encryptedObj: EncryptedToken
) {
  const res = await store("token:" + emailHashed, encryptedObj);
  if (!res) {
    throw new Error("Failed to store device in redis");
  }
}

async function registerOnChain(deviceId: string, ownerAddr: string) {
  try {
    const registerTx = await registerDevice(`0x${deviceId}`);
    const bindTx = await bindDevice(`0x${deviceId}`, ownerAddr);
    return {
      registerTx: registerTx.transactionHash,
      bindTx: bindTx.transactionHash,
    };
  } catch (error) {
    throw error;
  }
}
