import React from 'react'
import Layout from "../components/layout"
import styled from 'react-emotion'
import TextInput from '@umich-lib-ui/text-input'
import Button from '@umich-lib-ui/button'
import Icon from '@umich-lib-ui/icon'
import {
  Link
} from 'gatsby'
import {
  colors,
  MEDIA_QUERIES
} from '@umich-lib-ui/styles'
import Hero from '../components/hero'

const StyledSearchForm = styled('form')({
  margin: '1rem 0',
  width: '100%',
  [MEDIA_QUERIES.LARGESCREEN]: {
    width: '70%'
  },
  zIndex: '1'
})

const StyledGridContainer = styled('div')({
  [MEDIA_QUERIES.LARGESCREEN]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridColumnGap: '2rem'
  },
  margin: '1.5rem auto'
})

const StyledSection = styled('div')({
  marginBottom: '2rem',
  '*:first-child': {
    marginTop: 0
  }
})

const HomePage = () => {
  return (
    <Layout>
      <Hero>
        <StyledSearchForm action="https://search.lib.umich.edu/everything" method="get">
          <div style={{ display: 'flex' }}>
            <TextInput
              id="search-query"
              labelText="Search terms"
              type="search"
              hideLabel
              name="query"
              placeholder="Search the catalog, articles, databases, & more"
            />
            <Button
              type="submit"
              style={{
                whiteSpace: 'nowrap',
                marginLeft: '0.5rem'
              }
            }><Icon icon="search" size={24} /> Search</Button>
          </div>
        </StyledSearchForm>
      </Hero>

      <div data-inner-container>
        <p>No content here yet.</p>
      </div>
    </Layout>
  )
}

export default HomePage