import { useEffect, useState } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import DropDown from "./DropDown";

type InputProps = {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  register: any; //register is a useForm hook function of react-hook-form
  required?: boolean;
  pattern?: string;
};

const tailwindCssClass = {
  inputClass: "p-2 bg-gray-30 paragraph-3 rounded-sm border-gray-20  border focus:border-primary focus:ring-primary",
};

export const Input = ({ label, type, name, placeholder, register, required, pattern }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="paragraph-2">
        {label}
      </label>
      <input
        {...register(name, { required, pattern: { pattern } })}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className={tailwindCssClass.inputClass}
      />
    </div>
  );
};

export const TextArea = ({ label, type, name, placeholder, register, required, pattern }: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="paragraph-2">
        {label}
      </label>
      <textarea
        {...register(name, { required, pattern: { pattern } })}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className={tailwindCssClass.inputClass}
        rows="4"
      />
    </div>
  );
};

export const MultiSelect = () => {
  // state showing if dropdown is open or closed
  const [dropdown, setDropdown] = useState(false);
  // managing dropdown items (list of dropdown items)
  const items = ["john", "milos", "steph", "kathreine"];
  // contains selected items
  const [selectedItems, setSelected] = useState([]);

  const toogleDropdown = () => {
    setDropdown(!dropdown);
  };

  useEffect(() => {
    console.log("selectedItems", selectedItems);
  }, [selectedItems]);

  // adds new item to multiselect
  const addTag = (item) => {
    setSelected(selectedItems.concat(item));
    setDropdown(false);
  };
  // removes item from multiselect
  const removeTag = (item) => {
    const filtered = selectedItems.filter((e) => e !== item);
    setSelected(filtered);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full">
        <div className="flex flex-col items-center relative">
          <div className="w-full ">
            <div className={`flex justify-between items-center ${tailwindCssClass.inputClass}`}>
              {selectedItems.length > 0 ? (
                <div className="flex flex-auto flex-wrap ">
                  {selectedItems.map((tag, index) => {
                    return (
                      <div
                        key={index}
                        className="flex justify-center items-center mr-1 font-medium px-2 py-1 bg-white rounded-full text-primary  border border-gray-20 "
                      >
                        <div className="paragraph-3 leading-none max-w-full flex-initial">{tag}</div>
                        <div className="flex flex-auto flex-row-reverse">
                          <div onClick={() => removeTag(tag)}>
                            <XMarkIcon className="feather feather-x cursor-pointer hover:text-primary rounded-full w-4 h-4 ml-2" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="paragraph-3 text-gray-500">Select...</div>
              )}
              <div
                className="text-gray-20 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-20 cursor-pointer "
                onClick={toogleDropdown}
              >
                <ChevronDownIcon />
              </div>
            </div>
          </div>
        </div>
        {dropdown ? <DropDown list={items} addItem={addTag}></DropDown> : null}
      </div>
    </div>
  );
};
