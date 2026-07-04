import { prisma } from "@/lib/prisma";

export type SettingType = "TEXT" | "NUMBER" | "BOOLEAN" | "EMAIL" | "PERCENT";

export const defaultSettings = [
  {
    key: "company_name",
    value: "Fluido Credit",
    type: "TEXT",
    group: "COMPANY",
    label: "Company name",
  },
  {
    key: "support_email",
    value: "support@fluidocredit.com",
    type: "EMAIL",
    group: "COMPANY",
    label: "Support email",
  },
  {
    key: "admin_email",
    value: "user@fluidocredit.com",
    type: "EMAIL",
    group: "COMPANY",
    label: "Admin email",
  },
  {
    key: "default_currency",
    value: "EUR",
    type: "TEXT",
    group: "FINANCE",
    label: "Default currency",
  },
  {
    key: "loan_min_amount",
    value: "500",
    type: "NUMBER",
    group: "LOANS",
    label: "Minimum loan amount",
  },
  {
    key: "loan_max_amount",
    value: "50000",
    type: "NUMBER",
    group: "LOANS",
    label: "Maximum loan amount",
  },
  {
    key: "loan_default_rate",
    value: "5.5",
    type: "PERCENT",
    group: "LOANS",
    label: "Default annual rate",
  },
  {
    key: "withdrawal_processing_hours",
    value: "24",
    type: "NUMBER",
    group: "WITHDRAWALS",
    label: "Withdrawal processing hours",
  },
  {
    key: "document_review_hours",
    value: "24",
    type: "NUMBER",
    group: "DOCUMENTS",
    label: "Document review hours",
  },
  {
    key: "maintenance_mode",
    value: "false",
    type: "BOOLEAN",
    group: "SECURITY",
    label: "Maintenance mode",
  },
];

export async function ensureDefaultSettings() {
  for (const setting of defaultSettings) {
    await prisma.platformSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
}

export async function getPlatformSettings() {
  await ensureDefaultSettings();

  return prisma.platformSetting.findMany({
    orderBy: [{ group: "asc" }, { label: "asc" }],
  });
}

export async function getSettingValue(key: string, fallback = "") {
  const setting = await prisma.platformSetting.findUnique({
    where: { key },
  });

  return setting?.value ?? fallback;
}