import { Locale } from "@/@types";
import { IFormFieldItem } from "@/components/FormFields/@types";
import selectT from "@/utils/selectT";
import { useState } from "react";
import { FileInfo, TempImage } from "../../../@types/File";

export const useGetFormFields = (currentLanguage: Locale): IFormFieldItem[] => {
  const [tempImages, setTempImages] = useState<TempImage[]>([]);

  const descriptionPlaceholder = selectT(currentLanguage, {
    en: "My personal account",
    pt: "Minha conta pessoal",
  });

  return [
    {
      name: "name",
      label: {
        en: "Bank account name",
        pt: "Nome da conta",
      },
      inputType: "input",
      props: {
        placeholder: "Nubank",
      },
    },
    {
      name: "description",
      label: {
        en: "Description",
        pt: "Descrição",
      },
      inputType: "input",
      props: {
        placeholder: descriptionPlaceholder,
      },
    },
    {
      name: "image",
      label: {
        en: "Image",
        pt: "Imagem",
      },
      inputType: "imageInput",
      props: {
        type: "file",
      },
      tempImages: tempImages,
      setTempImages: setTempImages,
    },
  ];
};
