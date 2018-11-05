import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import styled from 'react-emotion'
import TextInput from '@umich-lib-ui/text-input'
import Button from '@umich-lib-ui/button'
import Icon from '@umich-lib-ui/icon'
import {
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

const LandingPageTemplate = ({ data }) => {
  const {
    title,
    relationships
  } = data.landingPages
  const {
    html
  } = data.landingPages.fields

  return (
    <Layout>
      <Hero image={relationships.field_hero_image.localFile.childImageSharp.fluid}>
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
        {html ? (
          <div dangerouslySetInnerHTML={{__html: html}} />
        ) : (
          <p>No content here yet.</p>
        )}
      </div>
    </Layout>
  )
}

export default LandingPageTemplate

export const query = graphql`
  query($slug: String!) {
    landingPages(fields: { slug: { eq: $slug } }) {
      title
      fields {
        html
      }
      relationships {
        pages {
          title
          path {
            alias
          }
        }
        field_hero_image {
          localFile {
            childImageSharp {
              fluid(maxWidth: 1920) {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`