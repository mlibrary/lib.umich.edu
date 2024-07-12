import PropTypes from 'prop-types';
import { Heading, Margins, SPACING } from '../reusable';
import Breadcrumb from '../components/breadcrumb';
import Layout from '../components/layout';
import Link from '../components/link';
import MEDIA_QUERIES from '../reusable/media-queries';
import React from 'react';
import SearchEngineOptimization from '../components/seo';
import useNavigationData from '../hooks/use-navigation-data';

const breadcrumbData = [
  {
    text: 'Home',
    to: '/'
  },
  {
    text: 'Site map'
  }
];

export default function SiteMap () {
  const { primary, secondary } = useNavigationData();

  return (
    <Layout>
      <Margins
        css={{
          marginBottom: SPACING['4XL']
        }}
      >
        <Breadcrumb data={JSON.stringify(breadcrumbData)} />
        <Heading
          size='3XL'
          level={1}
          css={{
            marginBottom: SPACING.L
          }}
        >
          Site map
        </Heading>

        <div
          css={{
            '> ol': {
              [MEDIA_QUERIES.M]: {
                columns: '2'
              },
              [MEDIA_QUERIES.L]: {
                columns: '3'
              }
            },
            '> ol > li': {
              breakInside: 'avoid',
              marginBottom: SPACING['3XL']
            },
            '> ol > li > ol': {
              listStyleType: 'lower-alpha'
            },
            '> ol > li > ol > li > ol': {
              listStyleType: 'lower-roman'
            },
            '> ol > li > ol > li > ol ol': {
              listStyleType: 'disc'
            }
          }}
        >
          <Heading
            size='L'
            level={2}
            css={{
              marginTop: SPACING.XL
            }}
          >
            Main navigation
          </Heading>
          <NestLinkedList data={primary} />

          <Heading
            size='L'
            level={2}
            css={{
              marginTop: SPACING.XL
            }}
          >
            Utility navigation
          </Heading>
          <NestLinkedList data={secondary} />
        </div>
      </Margins>
    </Layout>
  );
}

export const Head = () => {
  return <SearchEngineOptimization data={{ title: 'Site map' }} />;
};

const NestLinkedList = ({ data }) => {
  return (
    <ol
      css={{
        '> li': {
          breakInside: 'avoid'
        },
        listStyleType: 'decimal',
        marginLeft: SPACING.L
      }}
    >
      {data.map(({ text, to, children }) => {
        return (
          <li
            key={to}
            css={{
              margin: SPACING.S,
              marginLeft: '0'
            }}
          >
            <Link to={to}>{text}</Link>
            {children && <NestLinkedList data={children} />}
          </li>
        );
      })}
    </ol>
  );
};

NestLinkedList.propTypes = {
  data: PropTypes.shape({
    map: PropTypes.func
  })
};
