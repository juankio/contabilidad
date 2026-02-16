import { CalendarDate } from '@internationalized/date'

export const useCalendarDateInput = () => {
  const today = new Date()
  const dateValue = shallowRef(
    new CalendarDate(today.getFullYear(), today.getMonth() + 1, today.getDate())
  )

  return { dateValue }
}
