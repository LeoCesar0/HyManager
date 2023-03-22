export const test = (req, res) => {
  const data = {};

  res.status(200).json({ data: data });


  return res;
};

export default test;
