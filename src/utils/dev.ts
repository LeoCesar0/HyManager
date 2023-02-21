interface IDebugDev {
  type: "error" | "success";
  name: string;
  value: any;
}

export function debugDev({ type, name, value }: IDebugDev): string {
  let typeLabel = "Success";
  if (type === "error") typeLabel = "Error";
  if (type === "error" && typeof value !== "string" && !!value) {
    value = value?.message || value;
  }
  if (Array.isArray(value)) {
    value = value.join("; ");
  }
  console.log(`${typeLabel} ${name} -->`, value);
  const debugString = `${typeLabel} ${name} -->, ${value}`;
  return debugString;
}
