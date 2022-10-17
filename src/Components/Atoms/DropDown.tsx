import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, Key } from "react";

const DropDown = ({ list, addItem }: any) => {
  return (
    <div id="dropdown" className=" shadow top-100 bg-white z-40 w-full   rounded max-h-select overflow-y-auto ">
      <div className="flex flex-col w-full">
        {list.map(
          (
            item:
              | string
              | number
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | ReactFragment
              | ReactPortal
              | null
              | undefined,
            key: Key | null | undefined,
          ) => {
            return (
              <div
                key={key}
                className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-primary hover:text-white"
                onClick={() => addItem(item)}
              >
                <div className="flex w-full items-center p-1 pl-2 border-transparent  relative">
                  <div className="w-full items-center flex">
                    <div className="mx-2 leading-6  paragraph-2">{item}</div>
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
};

export default DropDown;
