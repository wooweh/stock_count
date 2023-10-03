/*





*/
export function formatCommaSeparatedNumber(number: number) {
  if (number === 0) {
    return "-"
  } else {
    return number.toLocaleString("en-US")
  }
}
/*





*/
export function formatLongDate(dateString: string) {
  const date = new Date(parseInt(dateString))
  const formattedDate = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
  return formattedDate
}
/*





*/
export function getTimeStamp() {
  return Date.now().toString()
}
/*





*/
export function calculateDuration(
  startTimestampString: string,
  endTimestampString: string,
) {
  const startTimestamp = parseInt(startTimestampString)
  const endTimestamp = parseInt(endTimestampString)

  const durationInMs = endTimestamp - startTimestamp

  const hours = Math.floor(durationInMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60))

  return `${hours}h ${minutes}m`
}
/*





*/
