type CxItemType = undefined | string | [string, boolean];
type CxPropsType = CxItemType[];

export const cx = (arrayProps: CxPropsType): string => {
  let finalClassName = "";

  for (const item of arrayProps) {
    if (item) {
      if (typeof item === "string") {
        finalClassName += ` ${item} `;
      } else {
        const [itemClassName, itemBoolean] = item;
        if (itemBoolean === true) {
          finalClassName += ` ${itemClassName} `;
        }
      }
    }
  }
  return finalClassName;
};

export const debugLog = (variable: any, name: string) => {
  console.log(`${name} -->`, variable);
};

export const dateToIsoString = (date: Date, { withTimeZone = true }) => {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? "+" : "-";
  const pad = (n) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");

  let isoString =
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    "T" +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes());

  if (withTimeZone) {
    isoString +=
      ":" +
      pad(date.getSeconds()) +
      diff +
      pad(tzOffset / 60) +
      ":" +
      pad(tzOffset % 60);
  }

  return isoString;
};

export function getTimezoneOffset() {
  const date = new Date();
  const timezoneOffsetInMinutes = date.getTimezoneOffset();
  const absTimezoneOffsetInMinutes = Math.abs(timezoneOffsetInMinutes);
  const hours = Math.floor(absTimezoneOffsetInMinutes / 60);
  const minutes = absTimezoneOffsetInMinutes % 60;
  const sign = timezoneOffsetInMinutes > 0 ? "-" : "+";

  return `${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}
