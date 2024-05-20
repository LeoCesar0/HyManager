export const makeChartTooltip = ({ content }: { content: string }) => {
  return (
    '<div class="custom-chart">' +
    '<div class="tooltip">' +
    "<span>" +
    content +
    "</span>" +
    "</div>" +
    "</div>"
  );
};
