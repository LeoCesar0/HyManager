import { TEST_CONFIG } from "@/static/testConfig";
import { getPDFRawData } from "../getPDFRawData";

describe("Test get pdf raw data", () => {
  test("should resolve with pdf raw data", async () => {
    const file = { filepath: TEST_CONFIG.pdfs[0].path };
    const rawData = await getPDFRawData({ file });
    expect(rawData?.Pages).toBeTruthy();
  });

  test("should reject with null on data error", async () => {
    const file = { filepath: "invalid/file/path.pdf" };
    const rawData = await getPDFRawData({ file, timeout: 5000 });
    expect(rawData).toBeNull();
  }, 10000);
});
