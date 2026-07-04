export const FLUIDO_BIC = "FLCRFRP1XXX";

export function generateFluidoIban(userId: string) {
  const clean = userId.replace(/[^0-9a-zA-Z]/g, "").toUpperCase();

  const accountNumber = clean
    .slice(-11)
    .padStart(11, "0");

  const bankCode = "30004";
  const branchCode = "00001";
  const ribKey = "97";

  return `FR76 ${bankCode} ${branchCode} ${accountNumber} ${ribKey}`;
}