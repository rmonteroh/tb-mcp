export function extractTokenFromAuthContext(extra?: {
  authContext?: string;
}): string {
  return extra?.authContext || "";
}
