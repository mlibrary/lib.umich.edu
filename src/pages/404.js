import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import { Heading, Text, SPACING, Margins, COLORS, List } from '@reusable';
import { GatsbyImage } from 'gatsby-plugin-image';
import SearchEngineOptimization from '../components/seo';
import Link from '../components/link';
import Prose from '../components/prose';
import Layout from '../components/layout';

import MEDIA_QUERIES from '../reusable/media-queries';

const NotFoundPage = () => {
  return (
    <Layout>
      <SearchEngineOptimization title="404 - Page not found" />
      <Margins
        css={{
          marginTop: SPACING['XL'],
          [MEDIA_QUERIES['M']]: {
            marginTop: SPACING['3XL'],
          },
        }}
      >
        <Image />
        <Heading size="3XL" level={1} css={{ marginBottom: SPACING['M'] }}>
          <span
            css={{
              fontSize: '60%',
              display: 'block',
              color: COLORS.orange['400'],
            }}
          >
            404
          </span>
          Page not found
        </Heading>
        <Prose
          css={{
            marginBottom: '8rem',
          }}
        >
          <Text lede>
            We can’t find the page you’re looking for. This can sometimes happen
            when:
          </Text>

          <List type="bulleted">
            <li>We’ve moved or renamed the page</li>
            <li>The page no longer exists</li>
            <li>There’s a slight typo in the web address </li>
            <li>The web address wasn’t copied fully</li>
          </List>

          <Text>
            If the web address is correct, please contact us at{' '}
            <Link to="/ask-librarian">Ask a Librarian</Link> and we’ll do our
            best to find what you’re looking for.
          </Text>

          <Text>
            You can also visit the <Link to="/">homepage</Link>, navigate
            through our menu options, or use site search.
          </Text>
        </Prose>
      </Margins>
    </Layout>
  );
};

function Image() {
  const imageData = useStaticQuery(graphql`
    {
      file(relativePath: { eq: "404.png" }) {
        childImageSharp {
          gatsbyImageData(width: 920, placeholder: NONE, layout: CONSTRAINED)
        }
      }
    }
  `);

  return (
    <div
      css={{
        display: 'block',
        [MEDIA_QUERIES['M']]: {
          margin: SPACING['L'],
          float: 'right',
          width: '40vw',
          shapeMargin: SPACING['XL'],
          shapeOutside:
            'polygon(65px 381px, 84px 210px, -18px 211px, -35px 141px, -11px 106px, 103px 115px, 123px 96px, 189px 111px, 262px 27px, 266px -14px, 313px -30px, 427px -29px, 475px 18px, 456px 75px, 458px 177px, 504px 163px, 632px 171px, 632px 225px, 536px 235px, 524px 490px, 44px 491px)',
          marginBottom: 0,
        },
        [MEDIA_QUERIES['L']]: {
          width: '50vw',
          maxWidth: '38rem',
        },
        marginBottom: SPACING['2XL'],
      }}
    >
      <GatsbyImage
        image={imageData.file.childImageSharp.gatsbyImageData}
        alt=""
      />
    </div>
  );
}

export default NotFoundPage;
