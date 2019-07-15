import React from 'react'

function Address({ data, ...rest }) {
  const {
    locality,
    address_line1,
    postal_code,
    administrative_area
  } = data

  return (
    <address {...rest}>
      <p>{address_line1}</p>
      <p>{locality}, {administrative_area} {postal_code}</p>
    </address>
  )
}

export default Address