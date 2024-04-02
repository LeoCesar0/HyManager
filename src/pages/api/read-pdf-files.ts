import { NextApiRequest, NextApiResponse } from "next";
import {
  PDF2JSONResponse,
  readPdfFilesRoute,
} from "@/server/routes/readPdfFilesRoute";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<PDF2JSONResponse>
) => {
  return await readPdfFilesRoute(req, res);
};

export default handler;
