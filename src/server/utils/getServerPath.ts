export const getServerPath = () => {
  let path = "development";
  if (process.env.NODE_ENV === "production") {
    path = "production";
  }
  if (process.env.NODE_ENV === "test") {
    path = "test";
  }

  return path;
};
