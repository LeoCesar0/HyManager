import { Locale } from "@/@types";
import { MakeFormFields } from "@/components/FormFields/@types";
import selectT from "@/utils/selectT";
import { useState } from "react";
import { TempImage } from "@/@types/File";
import { CreateBankCategory } from "@/server/models/BankAccount/schema";

export const useGetFormFields = (
  currentLanguage: Locale
): MakeFormFields<CreateBankCategory> => {
  const namePlaceholder = selectT(currentLanguage, {
    en: "Beer",
    pt: "Cerveja",
  });

  return [
    {
      name: "name",
      label: {
        en: "Name",
        pt: "Nome",
      },
      inputType: "input",
      props: {
        placeholder: namePlaceholder,
      },
    },
    {
      name: "color",
      label: {
        en: "Color",
        pt: "Cor",
      },
      inputType: "input",
      props: {
        type: "color",
      },
    },
  ];
};
