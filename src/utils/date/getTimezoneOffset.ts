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