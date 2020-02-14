import { useState, useEffect } from 'react'
const qs = require('qs')
/*
  Provides URL state
*/
export default function useUrlState(search) {
  // State and setters for debounced value
  const [urlState, setUrlState] = useState(
    qs.parse(search, { ignoreQueryPrefix: true })
  )

  useEffect(() => {}, [urlState])

  return [urlState, setUrlState]
}
