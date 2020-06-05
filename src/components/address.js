import React from 'react'
import getAddress from '../utils/get-address'

function Address({ data, ...rest }) {
  const address = getAddress({ node: data })

  return (
    <address {...rest}>
      {address.map((line, i) => (
        <p key={data.id + line + i}>{line}</p>
      ))}
    </address>
  )
}

export default Address
