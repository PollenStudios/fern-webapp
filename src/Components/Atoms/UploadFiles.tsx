import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

type UploadImagesProps = {
  maximumFiles: number;
  className: string;
  additionalClasses?: string;
  files: any;
  setFiles: any;
};

const ImageUploader = ({ maximumFiles, className, additionalClasses, files, setFiles }: UploadImagesProps) => {
  // const [files, setFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles: any) => {
    // const file = acceptedFiles[0];
    // let reader = new FileReader();
    // reader.onload = () => {
    //   console.log(reader.result);
    // };
    // reader.readAsDataURL(file),
    setFiles(
      acceptedFiles.map((file: Blob) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    );
  }, []);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    accept: { "image/png": [".png"], "image/jpeg": [".jpeg", ".jpg"] },
    onDrop,
    maxFiles: maximumFiles,
  });

  return (
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
  );
};

export default ImageUploader;
