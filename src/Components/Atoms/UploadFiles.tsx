import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import UploadImage from "../../Assets/Icons/uploadImg.png";

type UploadImagesProps = {
  maximumFiles: number;
  parentDivClassName: string;
  imageClassName?: string;
  images: String[];
  setImages: (images: string[]) => void;
};

const ImageUploader = ({ maximumFiles, parentDivClassName, imageClassName, images, setImages }: UploadImagesProps) => {
  const onDrop = useCallback((acceptedFiles: Array<object>) => {
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

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    accept: { "image/png": [".png"], "image/jpeg": [".jpeg", ".jpg"] },
    onDrop, //on image drag and drop this function will call
    maxFiles: maximumFiles, //no. of files we want to drop
  });

  return (
    <div>
      {images.length > 0 ? (
        <div className="flex flex-col md:flex-row gap-2">
          {images.map((file: any) => (
            <div key={file["name"]} className={parentDivClassName}>
              <img src={file["preview"]} className={`bg-gray-20 w-full h-full ${imageClassName}`} />
            </div>
          ))}
        </div>
      ) : (
        <div className={`${parentDivClassName} bg-gray-20 cursor-pointer flex items-center justify-center`} {...getRootProps()}>
          <input {...getInputProps()} />
          <div className="flex flex-col justify-center items-center">
            <img src={UploadImage} alt="upload-image" />
            <p className="text-center paragraph-2">{isDragReject ? "Not supported" : "Upload Image"}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
