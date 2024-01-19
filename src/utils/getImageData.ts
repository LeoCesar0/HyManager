import { ChangeEvent } from "react";
import { TempImage } from '@/@types/File';

export function getImageData(event: ChangeEvent<HTMLInputElement>) {
    // FileList is immutable, so we need to create a new one
    const dataTransfer = new DataTransfer();
    // Add newly uploaded images
    const tempImages: TempImage[] = []
  
    Array.from(event.target.files!).forEach((image) => {
      dataTransfer.items.add(image);
      const displayUrl = URL.createObjectURL(image);

      tempImages.push({
        file: image,
        previewUrl: displayUrl
      })
    });

  
    const files = dataTransfer.files;
  
    return { files, tempImages };
  }
  