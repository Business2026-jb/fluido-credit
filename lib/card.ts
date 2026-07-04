export type VirtualCardUser = {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
  emailVerified: boolean;
};

function digitsFromText(text: string, length: number) {
  let value = "";

  for (let i = 0; i < text.length; i++) {
    value += text.charCodeAt(i).toString();
  }

  return value.padEnd(length, "7").slice(0, length);
}

function formatCardNumber(value: string) {
  return value.replace(/(.{4})/g, "$1 ").trim();
}

export function getVirtualCard(user: VirtualCardUser) {
  const rawNumber = digitsFromText(`${user.id}${user.email}`, 16);
  const cvv = digitsFromText(`${user.email}${user.id}`, 3);

  const expiryDate = new Date(user.createdAt);
  expiryDate.setFullYear(expiryDate.getFullYear() + 3);

  const month = String(expiryDate.getMonth() + 1).padStart(2, "0");
  const year = String(expiryDate.getFullYear()).slice(-2);

  return {
    number: formatCardNumber(rawNumber),
    maskedNumber: `•••• •••• •••• ${rawNumber.slice(-4)}`,
    expiry: `${month}/${year}`,
    cvv,
    maskedCvv: "•••",
    holder: user.fullName.toUpperCase(),
    status: user.emailVerified ? "Active" : "Pending",
    brand: "FLUIDO",
    network: "VISA",
    type: "Virtual Debit",
    level: "Private Banking",
    currency: "EUR",
  };
}