import { COLORS, Heading, LINK_STYLES, List, SPACING } from '../../reusable';
import Link from '../link';
import LinkCallout from '../link-callout';
import { PanelTemplate } from './index';
import PropTypes from 'prop-types';
import React from 'react';
import usePageContextByDrupalNodeID from '../../hooks/use-page-context-by-drupal-node-id';

const getNIDFromURI = ({ uri }) => {
  if (uri.includes('entity:node/')) {
    return uri.split('/')[1];
  }

  return null;
};

const getContextByNID = ({ nids, nid }) => {
  const obj = nids[nid];

  return {
    text: obj.title,
    to: obj.slug
  };
};

export default function LinkPanel ({ data }) {
  const { relationships } = data;
  const { field_machine_name: fieldMachineName } = relationships.field_link_template;
  const nids = usePageContextByDrupalNodeID();

  switch (fieldMachineName) {
    case 'bulleted_list':{
      const links = data.field_link.map((link) => {
        const nid = getNIDFromURI({ uri: link.uri });
        const linkObj = nid
          ? getContextByNID({ nid, nids })
          : {
              text: link.title,
              to: link.uri
            };

        return linkObj;
      });
      const moreLink = data.field_view_all
        ? {
            text: data.field_view_all.title,
            to: data.field_view_all.uri
          }
        : null;
      const hasTopBorder = data.field_border === 'yes';

      return (
        <BulletedLinkList
          title={data.field_title}
          links={links}
          moreLink={moreLink}
          hasTopBorder={hasTopBorder}
        />
      );
    }
    case '2_column_db_link_list':
      return <DatabaseLinkList data={data} />;
    case 'related_links':
      return <RelatedLinks data={data} />;
    default:
      return null;
  }
}

LinkPanel.propTypes = {
  data: PropTypes.object
};

const BulletedLinkList = ({ title, links, moreLink, hasTopBorder = false }) => {
  return (
    <section
      css={{
        borderTop: hasTopBorder ? `solid 1px ${COLORS.neutral['100']}` : 'none',
        marginBottom: SPACING.XL,
        marginTop: SPACING.XL,
        paddingTop: hasTopBorder ? SPACING.XL : 0
      }}
    >
      <Heading level={2} size='M'>
        {title}
      </Heading>
      <List
        type='bulleted'
        css={{
          marginTop: SPACING.M
        }}
      >
        {links.map(({ text, to }, index) => {
          return (
            <li key={`bullet-${index}`}>
              <Link to={to}>{text}</Link>
            </li>
          );
        })}
      </List>

      {moreLink && (
        <p
          css={{
            marginTop: SPACING.M
          }}
        >
          <Link to={moreLink.to}>{moreLink.text}</Link>
        </p>
      )}
    </section>
  );
};

BulletedLinkList.propTypes = {
  hasTopBorder: PropTypes.bool,
  links: PropTypes.object,
  moreLink: PropTypes.object,
  title: PropTypes.string
};

const DatabaseLinkList = ({ data }) => {
  const { field_title: fieldTitle, field_link: fieldLink, field_view_all: fieldViewAll } = data;

  return (
    <section>
      <Heading level={2} size='M'>
        {fieldTitle}
      </Heading>
      <ol
        css={{
          columnGap: SPACING.XL,
          columns: '2',
          marginTop: SPACING.L,
          maxWidth: '24rem'
        }}
      >
        {fieldLink.map((fieldLinkData, item) => {
          return (
            <li
              key={fieldLinkData.title + item}
              css={{
                breakInside: 'avoid'
              }}
            >
              <Link
                kind='list'
                to={fieldLinkData.uri}
                css={{
                  ':hover': {
                    '[data-text]': {
                      ...LINK_STYLES.list[':hover']
                    },
                    boxShadow: 'none'
                  },
                  display: 'block',
                  paddingBottom: SPACING.S
                }}
              >
                <span data-text>{fieldLinkData.title}</span>
              </Link>
            </li>
          );
        })}
      </ol>

      {fieldViewAll && (
        <Link to={fieldViewAll.uri}>{fieldViewAll.title}</Link>
      )}
    </section>
  );
};

DatabaseLinkList.propTypes = {
  data: PropTypes.object
};

const RelatedLinks = ({ data }) => {
  const { field_title: fieldTitle, field_link: fieldLink } = data;
  return (
    <PanelTemplate title={fieldTitle}>
      <ol
        css={{
          '> li:not(:last-of-type)': {
            marginBottom: SPACING.S
          }
        }}
      >
        {fieldLink.map((link, item) => {
          return (
            <li
              key={`related-link-${item}`}
              css={{
                maxWidth: '34rem'
              }}
            >
              <FancyLink link={link} key={link.uri + item} />
            </li>
          );
        })}
      </ol>
    </PanelTemplate>
  );
};

RelatedLinks.propTypes = {
  data: PropTypes.object
};

const FancyLink = ({ link }) => {
  const nids = usePageContextByDrupalNodeID();
  const nid = getNIDFromURI({ uri: link.uri });
  const { text, to } = nid
    ? getContextByNID({ nid, nids })
    : {
        text: link.title,
        to: link.uri
      };

  return (
    <LinkCallout
      to={to}
      d='M3.61,12a3.13,3.13,0,0,0,.44,1.59,3.26,3.26,0,0,0,1.18,1.18,3.05,3.05,0,0,0,1.58.43H11v2H6.81a5.15,5.15,0,0,1-4.45-2.58,5.35,5.35,0,0,1,0-5.22A5.15,5.15,0,0,1,6.81,6.81H11v2H6.81a3.05,3.05,0,0,0-1.58.43,3.26,3.26,0,0,0-1.18,1.18A3.13,3.13,0,0,0,3.61,12Zm4.27,1V11h8.24v2Zm9.31-6.21a5.15,5.15,0,0,1,4.45,2.58,5.35,5.35,0,0,1,0,5.22,5.15,5.15,0,0,1-4.45,2.58H13v-2h4.17a3.05,3.05,0,0,0,1.58-.43A3.26,3.26,0,0,0,20,13.59a3.09,3.09,0,0,0,0-3.18,3.26,3.26,0,0,0-1.18-1.18,3.05,3.05,0,0,0-1.58-.43H13v-2Z'
    >
      {text}
    </LinkCallout>
  );
};

FancyLink.propTypes = {
  link: PropTypes.object
};
