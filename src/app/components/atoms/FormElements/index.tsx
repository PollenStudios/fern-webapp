import { Key, useState } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import DropDown from '../DropDown';
import { IInput, ISearch } from './types';

const tailwindCssClass = {
  inputClass: 'paragraph-3 rounded-sm border-gray-20  border focus:border-gray-500 focus:ring-gray-100',
};

export const Input = ({
  label,
  mark,
  type,
  name,
  placeholder,
  register,
  required,
  pattern,
  disabled,
  onChange,
}: IInput) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="heading-6 ">
        {label}
        {mark && <span className="pl-1 text-red-600">{mark}</span>}
      </label>

      <input
        {...register(name, { required, pattern: { value: pattern } })}
        type={type}
        id={name}
        name={name}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        className={`${tailwindCssClass.inputClass} px-2 py-3 ${
          disabled ? 'bg-gray-30 cursor-not-allowed' : 'bg-white'
        }`}
      />
    </div>
  );
};

export const TextArea = ({ label, type, name, placeholder, register, required, pattern, rows }: IInput) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="heading-6 ">
        {label}
      </label>
      <textarea
        {...register(name, { required, pattern: { value: pattern } })}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className={`${tailwindCssClass.inputClass} p-2 `}
        rows={rows}
      />
    </div>
  );
};

export const MultiSelect = ({
  name,
  label,
  placeholder,
  selectedItems,
  setSelectedItems,
  options,
  multiSelectError,
  setMultiSelectError,
}: ISearch) => {
  // state showing if isDropdownOpen is open or closed
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // adds new item to multiselect
  const addItemToMultiSelect = (item: string) => {
    setSelectedItems(selectedItems?.concat(item));
    setIsDropdownOpen(false);
    setMultiSelectError(false);
  };
  // removes item from multiselect
  const removeItemFromMultiSelect = (item: string) => {
    const filteredItems = selectedItems?.filter((selectedItem: string) => selectedItem !== item);
    setSelectedItems(filteredItems);
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-2">
        <label htmlFor={name} className="label">
          {label}
        </label>
        <div
          className={`flex justify-between items-center py-2 px-2 cursor-pointer ${tailwindCssClass.inputClass}`}
          onClick={toggleDropdown}
        >
          {selectedItems && selectedItems.length > 0 ? (
            <div className="flex flex-auto flex-wrap">
              {selectedItems?.map((item: string, index: Key) => {
                return (
                  <div
                    key={index}
                    className="flex justify-center items-center mr-1 font-medium px-2 py-1 my-1 bg-white rounded-full text-primary  border border-gray-20 "
                  >
                    <div className="paragraph-3 leading-none max-w-full flex-initial">{item}</div>
                    <div className="flex flex-auto flex-row-reverse">
                      <div onClick={() => removeItemFromMultiSelect(item)}>
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
          <div className="text-gray-20 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-20">
            <ChevronDownIcon />
          </div>
        </div>
      </div>
      {isDropdownOpen ? (
        <DropDown list={options} addItem={addItemToMultiSelect} selectedItems={selectedItems}></DropDown>
      ) : null}
      {multiSelectError && <p className="paragraph-3 text-red-600 pt-2">Please select any option</p>}
    </div>
  );
};
