import { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import UploadImage from './assets/UploadImage.svg';
import { IUploadImages } from './types';

const ImageUploader = ({ maximumFiles, parentDivClassName, imageClassName, images, setImages }: IUploadImages) => {
  // const [isImageUploadError, setIsImageUploadError] = useState(false);
  const onDrop = useCallback((acceptedFiles: any) => {
    setImages(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file), //generate blob object url of dropped image
        }),
      ),
    );
  }, []);

  // useEffect(() => {
  //   images?.length > maximumFiles ? setIsImageUploadError(false) : setIsImageUploadError(true);
  // }, [images, maximumFiles]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    accept: { 'image/png': ['.png'], 'image/jpeg': ['.jpeg', '.jpg'] },
    onDrop, //on image drag and drop this function will call
    maxFiles: maximumFiles, //no. of files we want to drop
  });

  return (
    <div>
      <div>
        {images?.length > 0 ? (
          <div className="flex flex-col md:flex-row gap-2">
            <div key={images[0].name} className={parentDivClassName}>
              <img
                src={images[0].preview}
                alt={images[0].name}
                className={`bg-gray-20 w-full h-full ${imageClassName}`}
                loading="lazy"
              />
            </div>
          </div>
        ) : (
          <div
            className={`${parentDivClassName} bg-gray-20 cursor-pointer flex items-center justify-center`}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col justify-center items-center">
              <img src={UploadImage} alt="upload-i-mage" />
              <p className="text-center paragraph-2">{isDragReject ? 'Not supported' : 'Upload Image'}</p>
            </div>
          </div>
        )}
      </div>
      {/* {isImageUploadError === true && (
        <div className="flex justify-center md:w-60">
          <p className="paragraph-3 text-red-600 pt-2">Please upload image</p>
        </div>
      )} */}
    </div>
  );
};

// export const ImagePreviewer = ({ height, width, imagePreview }: any) => {
//   return (
//     <>
//       {imagePreview ? (
//         <div className="w-full border h-40 lg:h-80 xl:h-60 flex  justify-center gap-4">
//           {<img className="w-full h-full object-contain" src={imagePreview} alt="uploading" />}
//         </div>
//       ) : (
//         //
//         <div className="border  h-40 lg:h-80 xl:h-60  flex flex-col justify-center gap-4">
//           <div className="flex  justify-center">
//             <img className="w-10" src={UploadImage} alt="uploading" />
//           </div>
//           <div>
//             <p className="paragraph-2 flex  justify-center">Upload image</p>
//             <p className="flex  justify-center paragraph-3 text-gray-40">Recommended size 430px x 450px </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

export const ImagePreviewer = ({ height, width, imagePreview, profileImage }: any) => {
  const tailwindCssClassForComponents = {
    profileImage: `w-40 border h-40 lg:w-80 lg:h-80 xl:w-60 xl:h-60 flex flex-col justify-center  gap-4 rounded-full`,
    postImage: 'w-full border h-60 lg:h-80 xl:h-80 flex flex-col justify-center gap-4"',
  };
  return (
    <div className="flex ">
      {imagePreview ? (
        <div
          className={
            profileImage ? tailwindCssClassForComponents.profileImage : tailwindCssClassForComponents.postImage
          }
        >
          {
            <img
              className={`w-full h-full ${profileImage ? 'object-cover rounded-full' : 'object-contain'} `}
              src={imagePreview}
              alt={profileImage ? 'profile' : 'post'}
            />
          }
        </div>
      ) : (
        // py-20
        <div
          className={
            profileImage ? tailwindCssClassForComponents.profileImage : tailwindCssClassForComponents.postImage
          }
        >
          <div className="flex justify-center">
            <img className="w-6 md:w-10" src={UploadImage} alt={profileImage ? 'profile' : 'post'} />
          </div>
          <div>
            <p className="paragraph-2 flex  justify-center">Upload image</p>
            <p className="text-center paragraph-3 text-gray-40 md:px-10">Recommended size 430px x 450px </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

ImagePreviewer.defaultProps = {
  height: '200px',
  width: '',
};
