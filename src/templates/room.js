import { graphql } from "gatsby"
import React from "react"
import Layout from "../components/layout"
import BreadCrumbs from "../components/breadcrumbs"
import styled from 'react-emotion'
import {
  MEDIA_QUERIES,
  Heading
} from '@umich-lib/core'

const StyledGrid = styled('div')({
  [MEDIA_QUERIES.LARGESCREEN]: {
    display: 'grid',
    gridTemplateColumns: 'auto 14rem',
    gridTemplateRows: 'max-content',
    gridTemplateAreas: `"main side"`,
    gridColumnGap: '2rem'
  }
})

const PageTemplate = ({ data }) => {
  const {
    title,
    field_square_feet,
    field_capacity
  } = data.nodeRoom

  return (
    <Layout>
      <div data-inner-container>
        <BreadCrumbs />
        <StyledGrid>
          <main
            style={{
              gridArea: 'main'
            }}
          >
            <Heading level={1} size="xlarge">{title}</Heading>

            <Heading level={2} size="large">Characteristics</Heading>
            <dl>
              <dt>Square feet</dt>
              <dd>{field_square_feet}</dd>
              <dt>Capacity</dt>
              <dd>{field_capacity}</dd>
            </dl>
          </main>
        </StyledGrid>
      </div>
    </Layout>
  )
}

export default PageTemplate

export const query = graphql`
  query($slug: String!) {
    nodeRoom(fields: { slug: { eq: $slug } }) {
      title
      field_square_feet
      field_capacity
    }
  }
`