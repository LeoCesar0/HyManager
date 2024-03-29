import Image from "next/image";
import { IImageInput } from "./@types";
import { PlusIcon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { getImageData } from "@/utils/getImageData";
import { useEffect } from "react";
import { FileInfo, TempImage } from "@/@types/File";

type ImageInputProps = {
  itemField: IImageInput<Record<string, any>>;
  formValues: any;
};

export const ImageInput = ({ itemField, formValues }: ImageInputProps) => {

  useEffect(() => {
    const values: FileInfo | FileInfo[] = formValues[itemField.name];
    if (Array.isArray(values)) {
      values.forEach((file) => {
        const temp: TempImage = {
          file: null,
          url: file.url,
        };
        itemField.setTempImages((prev) => [...prev, temp]);
      });
    } else {
      if (values && values.id && values.name && values.url) {
        const temp: TempImage = {
          file: null,
          url: values.url,
        };
        itemField.setTempImages((prev) => [...prev, temp]);
      }
    }
  }, []);

  return (
    <div className="flex gap-2 flex-wrap">
      {itemField.tempImages.map((imageUrl) => {
        return (
          <Image
            src={imageUrl.url}
            key={imageUrl.url}
            alt="image preview"
            width={64}
            height={64}
            className="rounded-md cursor-pointer"
          />
        );
      })}
      <label htmlFor={itemField.name}>
        <div className="h-16 w-16 rounded-md border cursor-pointer grid place-content-center">
          <PlusIcon className="h-8 w-8  text-muted-foreground" />
        </div>
      </label>
      <Input
        className="hidden"
        type="file"
        {...(itemField.props || {})}
        name={itemField.name}
        id={itemField.name}
        onChange={(event) => {
          const { tempImages } = getImageData(event);
          itemField.setTempImages((prev) => [...prev, ...tempImages]);
        }}
      />
    </div>
  );
};
