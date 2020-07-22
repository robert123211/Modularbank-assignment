
export const getCurrentTimestamp = () => {
  const date = new Date()
  return date.getTime()
}

export const getCurrentDateString = () => {
  const date = new Date()
  const monthNrInt = date.getMonth() + 1
  const monthNr = monthNrInt < 10 ? '0' + monthNrInt : monthNrInt
  const dateNrInt = date.getDate()
  const dateNr = dateNrInt < 10 ? '0' + dateNrInt : dateNrInt
  return `${date.getFullYear()}-${monthNr}-${dateNr}`
}
