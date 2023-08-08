import { IPDFDataParser } from "../../interfaces";
import { parse } from "./parse";
import { validateResults } from "./validateResults";

class NubankPDFParser implements IPDFDataParser {
  parse = parse
  validateResults = validateResults
}

export default NubankPDFParser;

/* ---------------------------------- UTILS --------------------------------- */
