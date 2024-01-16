
export const dateToIsoString = (date: Date, { withTimeZone = true }) => {
    const tzOffset = -date.getTimezoneOffset();
    const diff = tzOffset >= 0 ? "+" : "-";
    const pad = (n: number) => `${Math.floor(Math.abs(n))}`.padStart(2, "0");
  
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