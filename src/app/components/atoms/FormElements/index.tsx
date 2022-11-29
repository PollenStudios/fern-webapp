import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal } from 'react';
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/20/solid';
import DropDown from '../DropDown';
import { IInput, ISearch } from './types';

import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { PublicationSortCriteria } from 'graphql/generated/types';

const tailwindCssClass = {
  inputClass: 'paragraph-3 rounded-sm border-gray-20  border focus:border-gray-500 focus:ring-gray-100',
};

export const Input = ({
  label,
  prefix,
  type,
  name,
  placeholder,
  register,
  required,
  pattern,
  disabled,
  onChange, //we are using onChange for handle validation on sign up page,if user type handle name which exist on lens, so we will show error of same handle exist and when user change it so onchange we setishandlestate false;
}: IInput) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="heading-6 ">
        {label}
        {required && <span className="pl-1 text-red-600">*</span>}
      </label>
      <div className="flex">
        {prefix && (
          <span className="paragraph-3 rounded-sm border-gray-20  border border-r-0 inline-flex items-center px-3 text-gray-500 bg-gray-100 ">
            {prefix}
          </span>
        )}
        <input
          {...register(name, { required, pattern: { value: pattern } })}
          type={type}
          id={name}
          name={name}
          disabled={disabled}
          onChange={onChange}
          placeholder={placeholder}
          className={`${tailwindCssClass.inputClass} px-2 py-3 w-full ${
            disabled ? 'bg-gray-30 cursor-not-allowed' : 'bg-white'
          }`}
        />
      </div>
    </div>
  );
};

export const TextArea = ({ label, type, name, placeholder, register, required, pattern, rows }: IInput) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="heading-6 ">
        {label}
        {required && <span className="pl-1 text-red-600">*</span>}
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
    selectedItems && selectedItems?.length < 4 && setSelectedItems(selectedItems?.concat(item));
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

type Iprops = {
  selected: string;
  setSelected: any;
  options: Array<object | string>;
  setSortPosts: (item: boolean) => void;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Select({ selected, setSelected, options, setSortPosts }: Iprops) {
  return (
    <Listbox
      value={selected}
      onChange={art => {
        setSelected(art);
        setSortPosts(false);
      }}
    >
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-40 cursor-pointer rounded-full border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm  focus:outline-none sm:text-sm">
              <span className="block truncate">{selected}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-40 overflow-scroll rounded-md bg-white py-1 text-base shadow-lg  focus:outline-none sm:text-sm">
                {options?.map((option: object | string, id: number) => (
                  <Listbox.Option
                    key={id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-primary bg-gray-200' : 'text-primary',
                        'relative cursor-pointer select-none py-2 pl-3 pr-9',
                      )
                    }
                    value={option}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'primary' : 'font-normal', 'block truncate')}>
                          {/* TODO: ts-error Type 'string | object' is not assignable to type 'ReactNode'.
                            Type 'object' is not assignable to type 'ReactNode' */}
                          {/* @ts-ignore */}
                          {option}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
