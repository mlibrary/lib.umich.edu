import React from 'react'
import {
  SPACING,
  Icon,
  TextInput,
  Button
} from '@umich-lib/core'
import VisuallyHidden from '@reach/visually-hidden'

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
      role="search"
      aria-label="Sitewide"
    >
      <TextInput
        id="search-query"
        labelText="Search terms"
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
      >
        <Icon icon="search" size={20} />
        <VisuallyHidden>Submit</VisuallyHidden>
      </Button>
    </form>
  )
}

export default Search