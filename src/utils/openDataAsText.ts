export const openDataAsText = (data: any) => {
  const jsonString = JSON.stringify(data, null, 2);
  const jsonPre = `<pre>${jsonString}</pre>`;
  const blob = new Blob([jsonPre], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};
