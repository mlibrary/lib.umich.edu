import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import Img from 'gatsby-image'
import { Heading, SPACING, Text } from '@umich-lib/core'
import MEDIA_QUERIES from '../maybe-design-system/media-queries'

export default function NoResults({ children }) {
  const { image } = useStaticQuery(graphql`
    query {
      image: file(relativePath: { eq: "squirrel.png" }) {
        childImageSharp {
          fluid(maxWidth: 920) {
            ...GatsbyImageSharpFluid_noBase64
          }
        }
      }
    }
  `)

  return (
    <div
      css={{
        [MEDIA_QUERIES['L']]: {
          display: 'grid',
          gridTemplateColumns: `2fr 3fr`,
          gridGap: SPACING['3XL'],
          alignItems: 'end',
        },
        marginBottom: SPACING['4XL'],
        marginTop: SPACING['2XL'],
      }}
    >
      <div
        css={{
          margin: 'auto 0',
        }}
      >
        <Heading size="L" level={2}>
          We couldn't find any results
        </Heading>
        <Text
          lede
          css={{
            marginTop: SPACING['XS'],
          }}
        >
          {children}
        </Text>
      </div>

      <Img
        fluid={image.childImageSharp.fluid}
        alt=""
        css={{
          display: 'inline-block',
          maxWidth: '16rem',
          margin: '1rem auto',
          [MEDIA_QUERIES['L']]: {
            margin: '0',
            width: '100%',
            display: 'block',
            marginBottom: SPACING['L'],
          },
        }}
      />
    </div>
  )
}
