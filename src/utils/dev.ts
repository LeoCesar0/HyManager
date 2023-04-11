import { AppModelResponse } from "@types-folder/index";

interface IDebugDev {
  type: "error" | "success" | "call";
  name: string;
  value: any;
}

export function debugDev({ type, name, value }: IDebugDev): string {
  let typeLabel = "Success";
  if (type === "error") typeLabel = "Error";
  if (type === "call") typeLabel = "Calling";
  if (type === "error" && typeof value !== "string" && !!value) {
    value = value?.message || value;
  }
  if (Array.isArray(value)) {
    value = value.join("; ");
  }
  const log = `${typeLabel} ${name} -->`;
  if (type === "error") {
    console.error(log, value);
  } else {
    console.log(log, value);
  }
  const debugString = `Error: ${value}`;
  return debugString;
}

export function debugResults(
  results: AppModelResponse<any>,
  funcName: string
): void {
  if (results.error) {
    debugDev({ name: funcName, type: "error", value: results.error });
  }
  if (results.done || results.data) {
    debugDev({ name: funcName, type: "success", value: results.data });
  }
}
