import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import styled from 'react-emotion'
import TextInput from '@umich-lib/text-input'
import Button from '@umich-lib/button'
import Icon from '@umich-lib/icon'
import {
  MEDIA_QUERIES
} from '@umich-lib/styles'
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
    relationships
  } = data.nodeLandingPage
  const {
    html
  } = data.nodeLandingPage.fields

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
    nodeLandingPage(fields: { slug: { eq: $slug } }) {
      title
      fields {
        html
      }
      relationships {
        node__page {
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