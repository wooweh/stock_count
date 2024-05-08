import Papa from "papaparse"
import { StockItemProps } from "../features/stock/stockSlice"
/*





*/
export function CSVParser({
  onComplete,
}: {
  onComplete: (results: StockItemProps[]) => void
}) {
  function handleOnChange(event: any) {
    Papa.parse(event.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => onComplete(results.data),
    })
  }

  return (
    <input
      id="stock-upload-choose-file-input"
      type="file"
      name="file"
      onChange={handleOnChange}
      accept=".csv"
    />
  )
}
/*





*/
export function generateCSV(data: { [key: string]: string }[]) {
  return Papa.unparse(data)
}
/*





*/
export function downloadCSV(data: { [key: string]: string }[], name: string) {
  const csv = generateCSV(data)
  const downloadLink = document.createElement("a")
  const blob = new Blob(["\ufeff", csv])
  const url = URL.createObjectURL(blob)
  downloadLink.href = url
  downloadLink.download = `${name}.csv`

  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}
/*





*/
