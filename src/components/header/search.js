import React from 'react'
import {
  SPACING,
  Icon,
  TextInput,
  Button
} from '@umich-lib/core'

function Search() {
  return (
    <form
      action="https://search.lib.umich.edu/everything"
      method="get"
      css={{
        display: 'flex',
        height: '2.5rem',
        'input': {
          height: '100%'
        }
      }}
    >
      <TextInput
        id="search-query"
        labelText="Search"
        type="search"
        hideLabel
        name="query"
        placeholder="Search"
      />
      <Button
        type="submit"
        css={{
          marginLeft: SPACING['XS']
        }}
      ><Icon title="Search" icon="search" size={20} /></Button>
    </form>
  )
}

export default Search