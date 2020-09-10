import * as moment from 'moment'

export const EXHIBIT_TYPES = ['Exhibit', 'Exhibition']

/*
  Rules for how to handle parsing an event
  start and end date times and the kinds of
  display: brief (cards) and full (event page metadata).

  Use cases:

  (A) The event is an exhibit and it needs just
  the Month, Day range.

    Brief and Full
      => September 2 - October 30
      => December 10, 2020 - January 21, 2021

  (B) The event is not an exhibit and needs
  to display the full start and end. It all
  happens same day.

    Brief:
      => Tuesday, September 15 · 3:00pm - 3:50pm

    Full:
      => Tuesday, September 15, 2020 from 3:00pm - 3:50pm


  (C) A multi-day event. Show full range.

    Brief:
      => July 10 · 2:00pm to July 26 · 10:30am
      => December 15 · 3:00pm to January 8, 2021 · 3:50pm

    Full:
      => Wednesday, December 15, 2020 from 3:00pm to Friday, January 8, 2021 at 3:50pm
*/
export function eventFormatWhen({ start, end, kind, type }) {
  const isBrief = kind === 'brief'
  const isExhibit = EXHIBIT_TYPES.includes(type)
  const S = moment(start)
  const E = moment(end)
  const isSameYear = S.isSame(E, 'year')
  const isSameDay = S.isSame(E, 'day')

  // Exhibits share same format, regardless of kind.
  if (isExhibit) {
    if (isSameYear) {
      return S.format('MMMM D') + E.format(' [-] MMMM D')
    } else {
      return S.format('MMMM D, YYYY') + E.format(' [-] MMMM D, YYYY')
    }
  }

  if (isBrief) {
    if (isSameDay) {
      return S.format('dddd, MMMM D [·] h:mma - ') + E.format('h:mma')
    } else {
      if (isSameYear) {
        return (
          S.format('dddd, MMMM D [·] h:mma - ') +
          E.format('dddd, MMMM D [·] h:mma')
        )
      } else {
        return (
          S.format('dddd, MMMM D [·] h:mma - ') +
          E.format('dddd, MMMM D, YYYY [·] h:mma')
        )
      }
    }
  }

  if (isSameDay) {
    return S.format('dddd, MMMM D, YYYY [from] h:mma - ') + E.format('h:mma')
  }

  if (isSameYear) {
    return (
      S.format('dddd, MMMM D [·] h:mma - ') + E.format('dddd, MMMM D [·] h:mma')
    )
  }

  return (
    S.format('dddd, MMMM D [·] h:mma - ') +
    E.format('dddd, MMMM D, YYYY [·] h:mma')
  )
}

export function eventFormatWhere({ node, kind }) {
  const isOnline = node.field_event_online

  if (isOnline) {
    return 'Online'
  }

  const addressNode = node.relationships.field_event_building

  if (addressNode) {
    return addressNode.title
  }

  return 'not available'
}
