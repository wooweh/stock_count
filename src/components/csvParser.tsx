import Papa from "papaparse"
import { StockItemProps } from "../features/stock/stockSlice"
import useTheme from "../common/useTheme"
/*





*/
export function CSVParser({
  onComplete,
}: {
  onComplete: (results: StockItemProps[]) => void
}) {
  const theme = useTheme()

  function handleOnChange(event: any) {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => onComplete(results.data),
    })
  }

  return (
    <input type="file" name="file" onChange={handleOnChange} accept=".csv" />
  )
}
/*





*/
export function generateCSV(data: { [key: string]: string }[]) {
  return Papa.unparse(data)
}
/*





*/
