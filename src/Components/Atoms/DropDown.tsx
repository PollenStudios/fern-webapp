import { Key } from "react";

//Dropdown shown with list item
const DropDown = ({ list, addItem, selectedItems }: any) => {
  return (
    <div id="dropdown" className="absolute shadow top-100 bg-white z-40 w-full   rounded max-h-select overflow-y-auto ">
      <div className="flex flex-col w-full">
        {list.map((item: string, key: Key) => {
          return (
            <div
              key={key}
              className={`w-full ${
                selectedItems.includes(item)
                  ? `border-l-2 bg-gray-20 border-primary cursor-not-allowed`
                  : `border-gray-100 cursor-pointer  rounded-t border-b hover:bg-primary hover:text-white`
              }`}
              onClick={() => !selectedItems.includes(item) && addItem(item)}
            >
              <div className="w-full p-1 flex items-center">
                <div className="mx-2  paragraph-2">{item}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DropDown;
