import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Heading, SPACING, Text } from '../reusable';
import MEDIA_QUERIES from '../reusable/media-queries';

export default function NoResults({ children }) {
  const { image } = useStaticQuery(graphql`
    {
      image: file(relativePath: { eq: "squirrel.png" }) {
        childImageSharp {
          gatsbyImageData(width: 920, placeholder: NONE, layout: CONSTRAINED)
        }
      }
    }
  `);

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

      <GatsbyImage
        image={image.childImageSharp.gatsbyImageData}
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
  );
}
