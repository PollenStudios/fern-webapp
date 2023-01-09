export interface IDropdown {
  list: string[]
  addItem: (item: string) => void
  selectedItems: string[]
}
