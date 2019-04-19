export const categories = [
  'Science',
  'History',
  'Religion',
  'Thailand',
  'Art',
  'Music',
  'International',
  'Technology',
  'Health',
  'Food',
]

export const whWords = [
  'Who',
  'When',
  'Where',
  'What',
  'How + Adj/Adv',
]

export function saveFile(data, contentType, fileName="file", ext="txt") {
  const blob = new Blob([decodeURIComponent(encodeURI(data))], { type: contentType })
  const url = URL.createObjectURL( blob )
  const link = document.createElement( 'a' )
  link.setAttribute( 'href', url )
  link.setAttribute( 'download', fileName + '.' + ext )
  const event = document.createEvent( 'MouseEvents' )
  event.initMouseEvent( 'click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
  link.dispatchEvent( event )
}

export function jsonToCSV(json, header=false) {
  let fields = Object.keys(json[0])
  let csv = json.map(obj => {
    return fields.map(field => {
      return obj[field]
    }).join(',')
  })
  if (header) csv.splice(0, 0, fields)
  return csv.join('\n')
}