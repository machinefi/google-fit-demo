import { composeAmountStr, intToHexStr, tokenNumberToHex } from "./wei-to-hex";

export function buildTxData(
  functionAddr: string,
  recipient: string,
  tokenAmount: string
): string {
  const slotForRecipient = buildRecepientSlot(recipient);
  const slotForAmount = tokenNumberToHex(tokenAmount);

  return buildTxString([functionAddr, slotForRecipient, slotForAmount]);
}

export function buildRecepientSlot(recipient: string): string {
  return `000000000000000000000000${formatAddress(recipient)}`;
}

export function buildDeviceIdSlot(deviceId: string): string {
  return formatAddress(deviceId);
}

export function buildUINT256Slot(amount: u64): string {
  const hexStr = intToHexStr(amount);
  return composeAmountStr(hexStr);
}

export function formatAddress(address: string): string {
  return address.replaceAll("0x", "");
}

export function buildTxString(args: string[]): string {
  return "0x" + args.join("");
}
