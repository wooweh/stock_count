import {
  NotificationNames,
  generateNotification,
} from "../features/core/coreUtils"
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
export function formatLongDate(timeStamp: number) {
  const date = new Date(Number(timeStamp))
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
  return Date.now()
}
/*





*/
export function calculateDuration(
  startTimestamp: number,
  endTimestamp: number,
) {
  const durationInMs = endTimestamp - startTimestamp
  return durationInMs
}
/*





*/
export function formatDuration(durationInMs: number) {
  const hours = Math.floor(durationInMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60))

  if (!hours) {
    return `${minutes} min`
  } else {
    return `${hours}h ${minutes}m`
  }
}
/*





*/
export function copyToClipboard(text: string, notification: NotificationNames) {
  navigator.clipboard
    .writeText(text)
    .then(() => generateNotification(notification))
}
/*





*/
export function trimEmptyLines(string: string) {
  const lines = string.split("\n")
  while (lines.length > 0 && lines[lines.length - 1].trim() === "") {
    lines.pop()
  }
  return lines.join("\n")
}
/*





*/
