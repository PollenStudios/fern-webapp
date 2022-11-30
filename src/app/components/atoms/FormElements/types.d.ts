import { UseFormRegister } from 'react-hook-form';

export interface IInput {
  label: string;
  type: string;
  name: string;
  placeholder: string;
  register?: UseFormRegister; //register is a useForm hook function of react-hook-form use to set value in input
  required?: boolean;
  pattern?: RegExp;
  rows?: number;
  disabled?: boolean;
  onChange?: any;
  prefix?: 'https';
}

export interface ISearch {
  label: string;
  name: string;
  placeholder: string;
  selectedItems?: string[];
  setSelectedItems?: any; //setSelectedItems is a function to set selected options in array
  options?: Array<string>;
  multiSelectError?: boolean;
  setMultiSelectError?: any;
  required?: boolean;
}

export interface LoginModalProps {
  walletAddress: string;
  heading: string | undefined;
  paragraph?: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  websiteUrl?: string;
}
