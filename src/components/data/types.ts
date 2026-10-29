export interface TableColumn<T> {
  key: string
  label: string
  align?: 'left' | 'right' | 'center'
  width?: string
  headerClass?: string
  cellClass?: string | ((row: T) => string)
}
