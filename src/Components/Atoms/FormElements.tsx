import { Key, useState } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import DropDown from "./DropDown";

type InputProps = {
  label?: string;
  type?: string;
  name?: string;
  placeholder: string;
  register?: any; //register is a useForm hook function of react-hook-form
  required?: boolean;
  pattern?: string;
  selectedItems?: string[] | undefined; //selectedItems is the array
  setSelected?: any; //setSelected is a function to set selected options in array
  options?: Array<string>;
  error?: boolean;
  setError?: any;
};

const tailwindCssClass = {
  inputClass: "bg-gray-30 paragraph-3 rounded-sm border-gray-20  border focus:border-primary focus:ring-primary",
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
        className={`${tailwindCssClass.inputClass} p-2 `}
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
        className={`${tailwindCssClass.inputClass} p-2 `}
        rows="4"
      />
    </div>
  );
};

export const MultiSelect = ({ selectedItems, setSelected, placeholder, name, label, options, error, setError }: InputProps) => {
  // state showing if dropdown is open or closed
  const [dropdown, setDropdown] = useState(false);

  const toogleDropdown = () => {
    setDropdown(!dropdown);
  };

  // adds new item to multiselect
  const addTag = (item: any) => {
    setSelected(selectedItems?.concat(item));
    setDropdown(false);
    setError(false);
  };
  // removes item from multiselect
  const removeTag = (item: any) => {
    const filtered = selectedItems?.filter((e: any) => e !== item);
    setSelected(filtered);
  };

  return (
    <div>
      <div className="flex flex-col gap-2">
        <label htmlFor={name} className="paragraph-2">
          {label}
        </label>
        <div className={`flex justify-between items-center py-1 px-2 ${tailwindCssClass.inputClass}`}>
          {selectedItems && selectedItems.length > 0 ? (
            <div className="flex flex-auto flex-wrap ">
              {selectedItems?.map((tag: string, index: Key) => {
                return (
                  <div
                    key={index}
                    className="flex justify-center items-center mr-1 font-medium px-2 py-1 bg-white rounded-full text-primary  border border-gray-20 "
                  >
                    <div className="paragraph-3 leading-none max-w-full flex-initial">{tag}</div>
                    <div className="flex flex-auto flex-row-reverse">
                      <div onClick={() => removeTag(tag)}>
                        <XMarkIcon className="cursor-pointer hover:text-primary rounded-full w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="paragraph-3 text-gray-500">{placeholder}</div>
          )}
          <div
            className="text-gray-20 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-20 cursor-pointer "
            onClick={toogleDropdown}
          >
            <ChevronDownIcon />
          </div>
        </div>
      </div>
      {dropdown ? <DropDown list={options} addItem={addTag} selectedItems={selectedItems}></DropDown> : null}
      {error && <p className="paragraph-3 text-red-600 pt-2">Please select any option</p>}
    </div>
  );
};
