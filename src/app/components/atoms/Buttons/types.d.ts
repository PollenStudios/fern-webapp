export interface IButton {
  variant: 'primary' | 'outline' | 'danger' | 'success' | 'warning';
  name: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
  icon?: string;
  onClick?: any;
  additionalClasses?: string;
}
