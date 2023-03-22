import { ptBR } from "date-fns/locale";
import { isValid, parse } from "date-fns";
import { dateToIsoString } from "src/utils/misc";

const Test = () => {
  const dateAsLocaleString = "02/10/2022";
  const dateObject = parse(dateAsLocaleString, "P", new Date(), {
    locale: ptBR,
  });

  const userTimeZone = new Date().getTimezoneOffset();

  const toLocaleString = dateObject.toLocaleString();
  const toISOString = dateObject.toISOString();

  const dateObject2 = new Date(toISOString);
  const toLocaleString2 = dateObject2.toLocaleString();
  const toISOString2 = dateObject2.toISOString();

  //   const testDate = dateToIsoString(dateObject, { withTimeZone: true });

  console.log("dateAsLocaleString -->", dateAsLocaleString);
  console.log("toLocaleString -->", toLocaleString);
  console.log("toISOString -->", toISOString);
  console.log("dateObject -->", dateObject);
  console.log("-- /2/ --");
  //   console.log("userTimeZone -->", userTimeZone);
  //   console.log("testDate -->", testDate);
  console.log("-----------------------------------------------");
  return (
    <>
      <h1>Test Page</h1>
    </>
  );
};

export default Test;
