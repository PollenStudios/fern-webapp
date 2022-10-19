import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import UploadImage from "../../Assets/Icons/uploadImg.png";

type UploadImagesProps = {
  maximumFiles: number;
  parentDivClassName: string;
  imageClassName?: string;
  images: String[];
  setImages: (images: string[]) => void;
  isImageError?: boolean;
  setIsImageError?: any;
};

const ImageUploader = ({
  maximumFiles,
  className,
  additionalClasses,
  files,
  setFiles,
  isImageError,
  setIsImageError,
}: UploadImagesProps) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    // const file = acceptedFiles[0];
    // let reader = new FileReader();
    // reader.onload = () => {
    //   console.log(reader.result);
    // };
    // reader.readAsDataURL(file),
    setImages(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file), //generate blob object url of dropped image
        }),
      ),
    );
  }, []);

  useEffect(() => {
    files.length > 0 && setIsImageError(false);
  }, [files]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    accept: { "image/png": [".png"], "image/jpeg": [".jpeg", ".jpg"] },
    onDrop, //on image drag and drop this function will call
    maxFiles: maximumFiles, //no. of files we want to drop
  });

  return (
    <div>
      <div>
        {files.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-2">
            {files.map((file: { [x: string]: string | undefined }) => (
              <div key={file["name"]} className={className}>
                <img src={file["preview"]} className={`bg-gray-20 w-full h-full ${additionalClasses}`} />
              </div>
            ))}
          </div>
        ) : (
          <div className={`${className} bg-gray-20 cursor-pointer flex items-center justify-center`} {...getRootProps()}>
            <input {...getInputProps()} />
            <p className="text-center paragraph-3">
              {isDragReject ? "Only jpeg, jpg and png files are supported" : "Please Upload .png, .jpg or .jpeg files only"}
            </p>
          </div>
        )}
      </div>
      {isImageError && (
        <div className="flex justify-center md:w-60">
          <p className="paragraph-3 text-red-600 pt-2">Please upload image</p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
