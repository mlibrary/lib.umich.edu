import React from 'react'
import { SPACING, Heading, LINK_STYLES, Icon } from '@umich-lib/core'
import Link from '../link'
import usePageContextByDrupalNodeID from '../../hooks/use-page-context-by-drupal-node-id'
import { COLORS } from '@umich-lib/styles'
import { PanelTemplate } from './index'
import PlainLink from '../plain-link'

export default function LinkPanel({ data }) {
  const { relationships } = data
  const { field_machine_name } = relationships.field_link_template

  switch (field_machine_name) {
    case '2_column_db_link_list':
      return <DatabaseLinkList data={data} />
    case 'related_links':
      return <RelatedLinks data={data} />
    default:
      return null
  }
}

function DatabaseLinkList({ data }) {
  const { field_title, field_link } = data

  return (
    <section>
      <Heading level={2} size="XL">
        {field_title}
      </Heading>
      <ol
        css={{
          maxWidth: '24rem',
          columns: '2',
          columnGap: SPACING['XL'],
          marginTop: SPACING['L'],
        }}
      >
        {field_link.map((d, i) => (
          <li key={d.title + i}>
            <Link
              kind="list"
              to={d.uri}
              css={{
                display: 'block',
                paddingBottom: SPACING['S'],
                ':hover': {
                  boxShadow: 'none',
                  '[data-text]': {
                    ...LINK_STYLES['list'][':hover'],
                  },
                },
              }}
            >
              <span data-text>{d.title}</span>
            </Link>
          </li>
        ))}
      </ol>

      <Link
        kind="list-strong"
        to="https://search.lib.umich.edu/databases/browse"
      >
        View all databases
      </Link>
    </section>
  )
}

function RelatedLinks({ data }) {
  const { field_title, field_link } = data
  return (
    <PanelTemplate title={field_title}>
      <ol>
        {field_link.map((link, i) => (
          <li
            css={{
              maxWidth: '420px',
              marginBottom: SPACING['S'],
            }}
          >
            <FancyLink link={link} key={link.uri + i} />
          </li>
        ))}
      </ol>
    </PanelTemplate>
  )
}

function FancyLink({ link }) {
  const nids = usePageContextByDrupalNodeID()
  const nid = getNIDFromURI({ uri: link.uri })
  const { text, to } = nid
    ? getContextByNID({ nids, nid })
    : {
        text: link.title,
        to: link.uri,
      }

  return (
    <PlainLink
      to={to}
      css={{
        display: 'block',
        padding: SPACING['M'],
        background: COLORS.teal['100'],
        ':hover [data-link]': LINK_STYLES['description'][':hover'],
        borderRadius: '2px',
      }}
    >
      <span
        css={{
          color: COLORS.teal['400'],
          marginRight: SPACING['XS'],
        }}
      >
        <Icon
          d="M3.61,12a3.13,3.13,0,0,0,.44,1.59,3.26,3.26,0,0,0,1.18,1.18,3.05,3.05,0,0,0,1.58.43H11v2H6.81a5.15,5.15,0,0,1-4.45-2.58,5.35,5.35,0,0,1,0-5.22A5.15,5.15,0,0,1,6.81,6.81H11v2H6.81a3.05,3.05,0,0,0-1.58.43,3.26,3.26,0,0,0-1.18,1.18A3.13,3.13,0,0,0,3.61,12Zm4.27,1V11h8.24v2Zm9.31-6.21a5.15,5.15,0,0,1,4.45,2.58,5.35,5.35,0,0,1,0,5.22,5.15,5.15,0,0,1-4.45,2.58H13v-2h4.17a3.05,3.05,0,0,0,1.58-.43A3.26,3.26,0,0,0,20,13.59a3.09,3.09,0,0,0,0-3.18,3.26,3.26,0,0,0-1.18-1.18,3.05,3.05,0,0,0-1.58-.43H13v-2Z"
          size={24}
        />
      </span>
      <span
        data-link
        css={{
          ...LINK_STYLES['description'],
          fontSize: '1rem',
          color: COLORS.neutral['400'],
        }}
      >
        {text}
      </span>
    </PlainLink>
  )
}

function getNIDFromURI({ uri }) {
  if (uri.includes('entity:node/')) {
    return uri.split('/')[1]
  }

  return null
}

function getContextByNID({ nids, nid }) {
  const obj = nids[nid]

  return {
    text: obj.title,
    to: obj.slug,
  }
}
