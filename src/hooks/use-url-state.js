import { useState, useEffect } from 'react'
const qs = require('qs')
/*
  Provides URL state
*/
export default function useUrlState(search, keys) {
  const [urlState, setUrlState] = useState()

  useEffect(() => {
    qs.parse(search, { ignoreQueryPrefix: true })
    if (object) {
    }
  }, [])

  useEffect(() => {}, [urlState])

  return [urlState, setUrlState]
}
