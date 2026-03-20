const ALERT_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
const STATUS_REPORTS = ["REPORTED", "IN_PROCESS", "RESOLVED"] as const;

export type AlertPriority = (typeof ALERT_PRIORITIES)[number];
export type StatusReportValue = (typeof STATUS_REPORTS)[number];

export interface UpgradeRequestInfo {
  userId: string;
  userRole: string;
}

export function parseUpgradeRequestUrl(
  rawUrl: string | undefined
): UpgradeRequestInfo | null {
  if (!rawUrl) {
    return null;
  }

  const [pathPart, queryPart = ""] = rawUrl.split("/?");
  const userId = pathPart.split("/").filter(Boolean)[0];
  const userRole = decodeURIComponent(queryPart).trim();

  if (!userId || !userRole) {
    return null;
  }

  return {
    userId,
    userRole,
  };
}

export function isValidAlertPriority(
  value: string
): value is AlertPriority {
  return ALERT_PRIORITIES.includes(value as AlertPriority);
}

export function isValidStatusReport(
  value: string
): value is StatusReportValue {
  return STATUS_REPORTS.includes(value as StatusReportValue);
}
