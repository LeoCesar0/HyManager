import fs from "fs";
import { PdfReader } from "pdfreader";


export const pdftest = async (req, res) => {
  let data = []

  const promise = new Promise((resolve, reject) => {
    fs.readFile("public/test/pdfs/2023-06.pdf", (err, pdfBuffer) => {
      // pdfBuffer contains the file content
      if (err) {
        console.error("error fs:", err);
        reject()
      }
      new PdfReader().parseBuffer(pdfBuffer, (err, item) => {
        if (err) console.error("error:", err);
        else if (!item) {
          resolve(data)
        }
        else if (item.text) {
          console.log(item.text);
          data.push(item.text)
        }
        
      });
    });
  })

  await promise

  res.status(200).json({ data: data });

  return res;
};

export default pdftest;
