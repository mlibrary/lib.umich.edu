import { graphql, useStaticQuery } from 'gatsby';
import { Heading, SPACING, Text } from '../reusable';
import { GatsbyImage } from 'gatsby-plugin-image';
import MEDIA_QUERIES from '../reusable/media-queries';
import PropTypes from 'prop-types';
import React from 'react';

export default function NoResults ({ children }) {
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
        [MEDIA_QUERIES.L]: {
          alignItems: 'end',
          display: 'grid',
          gridGap: SPACING['3XL'],
          gridTemplateColumns: `2fr 3fr`
        },
        marginBottom: SPACING['4XL'],
        marginTop: SPACING['2XL']
      }}
    >
      <div
        css={{
          margin: 'auto 0'
        }}
        aria-live='assertive'
      >
        <Heading size='L' level={2}>
          We couldn&rsquo;t find any results
        </Heading>
        <Text
          lede
          css={{
            marginTop: SPACING.XS
          }}
        >
          {children}
        </Text>
      </div>

      <GatsbyImage
        image={image.childImageSharp.gatsbyImageData}
        alt=''
        css={{
          display: 'inline-block',
          margin: '1rem auto',
          maxWidth: '16rem',
          [MEDIA_QUERIES.L]: {
            display: 'block',
            margin: '0',
            marginBottom: SPACING.L,
            width: '100%'
          }
        }}
      />
    </div>
  );
}

NoResults.propTypes = {
  children: PropTypes.node
};
