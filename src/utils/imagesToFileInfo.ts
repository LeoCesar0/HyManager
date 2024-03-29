import { AnyObject } from "@/@types";
import { FileInfo } from "@/@types/File";
import { IImageInput, MakeFormFields } from "@/components/FormFields/@types";
import { uploadSingleFile } from "@/components/TransactionsFileInput/uploadFilesToStorage";
import { asyncForEach } from "./asyncForEach";
import cloneDeep from "lodash.clonedeep";

type IProps<T extends AnyObject> = {
  bankAccountId: string;
  formFields: MakeFormFields<T>;
  formValues: T;
  imageFields: { name: keyof T; multiple: boolean }[];
};

export const imagesToFileInfo = async <T extends AnyObject>({
  formFields,
  bankAccountId,
  imageFields,
  formValues,
}: IProps<T>) => {
  type _T = Record<keyof T, FileInfo[]>;
  let filesInfo: _T = {} as _T;

  await asyncForEach(imageFields, async (field) => {
    const promises: Promise<FileInfo>[] = [];

    const imageInput = formFields.find(
      (item) => item.name === field.name
    ) as IImageInput<T>;

    const multiple = field.multiple;
    const tempImages = imageInput.tempImages;

    const foundPrevious: FileInfo | FileInfo[] | undefined =
      formValues[field.name];

    if (multiple && Array.isArray(foundPrevious)) {
      filesInfo[field.name] = [...foundPrevious].filter((item) =>
        tempImages.some((img) => img.url === item.url)
      );
    }
    if (!multiple && foundPrevious && !Array.isArray(foundPrevious)) {
      filesInfo[field.name] = [foundPrevious].filter((item) => {
        return tempImages.some((img) => img.url === item.url);
      });
    }

    tempImages.forEach((image) => {
      if (image.file) {
        const promise = uploadSingleFile(image.file, bankAccountId);
        promises.push(promise);
      }
    });

    filesInfo[field.name] = [
      ...(filesInfo[field.name] || []),
      ...(await Promise.all(promises)),
    ];
  });

  const results: T = cloneDeep(formValues);

  imageFields.forEach((field) => {
    const value: FileInfo[] = filesInfo[field.name];
    if (value) {
      results[field.name] = field.multiple ? value : (value[0] as any);
    }
  });

  return {
    ...results,
  };
};
