export function parseBrowser(ua: string): string {
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  return "Other";
}

export function parseDevice(ua: string): string {
  if (/iPhone|iPod|Android.*Mobile|Windows Phone/.test(ua)) return "Mobile";
  if (/iPad|Android(?!.*Mobile)|Tablet/.test(ua)) return "Tablet";
  return "Desktop";
}
