import { graphql, useStaticQuery } from 'gatsby';
import { Heading, List, Margins, SPACING, Text } from '../reusable';
import { GatsbyImage } from 'gatsby-plugin-image';
import Layout from '../components/layout';
import Link from '../components/link';
import MEDIA_QUERIES from '../reusable/media-queries';
import Prose from '../components/prose';
import React from 'react';
import SearchEngineOptimization from '../components/seo';

const NotFoundPage = () => {
  return (
    <Layout>
      <Margins
        css={{
          marginTop: SPACING.XL,
          [MEDIA_QUERIES.M]: {
            marginTop: SPACING['3XL']
          }
        }}
      >
        <Image />
        <Heading size='3XL' level={1} css={{ marginBottom: SPACING.M }}>
          <span
            css={{
              color: 'var(--color-orange-400)',
              display: 'block',
              fontSize: '60%'
            }}
          >
            404
          </span>
          Page not found
        </Heading>
        <Prose
          css={{
            marginBottom: '8rem'
          }}
        >
          <Text lede>
            We can’t find the page you’re looking for. This can sometimes happen
            when:
          </Text>

          <List type='bulleted'>
            <li>We’ve moved or renamed the page</li>
            <li>The page no longer exists</li>
            <li>There’s a slight typo in the web address </li>
            <li>The web address wasn’t copied fully</li>
          </List>

          <Text>
            If the web address is correct, please contact us at
            {' '}
            <Link to='/ask-librarian'>Ask a Librarian</Link>
            {' '}
            and we’ll do our
            best to find what you’re looking for.
          </Text>

          <Text>
            You can also visit the
            {' '}
            <Link to='/'>homepage</Link>
            , navigate
            through our menu options, or use site search.
          </Text>
        </Prose>
      </Margins>
    </Layout>
  );
};

const Image = () => {
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
        [MEDIA_QUERIES.M]: {
          float: 'right',
          margin: SPACING.L,
          marginBottom: 0,
          shapeMargin: SPACING.XL,
          shapeOutside:
            'polygon(65px 381px, 84px 210px, -18px 211px, -35px 141px, -11px 106px, 103px 115px, 123px 96px, 189px 111px, 262px 27px, 266px -14px, 313px -30px, 427px -29px, 475px 18px, 456px 75px, 458px 177px, 504px 163px, 632px 171px, 632px 225px, 536px 235px, 524px 490px, 44px 491px)',
          width: '40vw'
        },
        [MEDIA_QUERIES.L]: {
          maxWidth: '38rem',
          width: '50vw'
        },
        marginBottom: SPACING['2XL']
      }}
    >
      <GatsbyImage
        image={imageData.file.childImageSharp.gatsbyImageData}
        alt=''
      />
    </div>
  );
};

export default NotFoundPage;

export const Head = () => {
  return <SearchEngineOptimization data={{ title: '404 - Page not found' }} />;
};
