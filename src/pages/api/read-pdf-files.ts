import { NextApiRequest, NextApiResponse } from "next";
import { PDF2JSONResponse, readPDFRoute } from "@/server/routes/readPDFRoute";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<PDF2JSONResponse>
) => {
  return await readPDFRoute(req, res);
};

export default handler;
