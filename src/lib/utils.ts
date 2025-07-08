import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getReadableError(err: any): string {
  if (!err) return "Unknown error";
  // Ethers v6 user rejection
  if (err.code === 4001) return "Transaction rejected by user.";
  // Ethers v5 user rejection
  if (err?.error?.code === 4001) return "Transaction rejected by user.";
  // Ethers v6 revert reason
  if (err.data && typeof err.data === "object" && err.data.message) return err.data.message;
  // Ethers v5 revert reason
  if (err.error && typeof err.error === "object" && err.error.message) return err.error.message;
  // Ethers reason
  if (err.reason) return err.reason;
  // Ethers message
  if (err.message) return err.message;
  // Fallback
  return typeof err === "string" ? err : JSON.stringify(err);
}
