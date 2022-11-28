import { Key } from 'react';
import toast from 'react-hot-toast';
import { IDropdown } from './types';

const DropDown = ({ list, addItem, selectedItems }: IDropdown) => {
  const handleSelectedItem = (item: string) => {
    if (selectedItems.includes(item)) {
      return 'border-l-2 bg-gray-20 border-primary cursor-not-allowed';
    } else {
      return 'border-gray-100 cursor-pointer  rounded-t border-b hover:bg-primary hover:text-white';
    }
  };

  return (
    <div
      id="dropdown"
      className="border border-t-0 absolute shadow top-100 bg-white z-10 w-full   rounded max-h-select overflow-y-auto "
    >
      <div className="flex flex-col w-full">
        {list.map((item: string, id: Key) => {
          return (
            <div
              key={id}
              className={`w-full ${handleSelectedItem(item)}`}
              onClick={() => {
                !selectedItems.includes(item) && addItem(item);
                selectedItems.length === 4 && toast.error('You can not add more than 4 Categories');
              }}
            >
              <div className="w-full p-2 flex items-center">
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

DropDown.defaultProps = {
  list: [],
  selectedItems: [],
};
