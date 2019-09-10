import React from 'react'
import {
  Heading,
  SPACING,
  COLORS,
  Margins,
  Icon,
  MEDIA_QUERIES
} from '@umich-lib/core'

import Card from './card'
import Link from './link'
import HTML from './html'
import Address from './address'
import Hours from './hours'
import icons from '../reusable/icons'

function PanelTemplate({ title, children, shaded, ...rest }) {
  return (
    <section
      css={{
        background: shaded ? COLORS.blue['100'] : '',
        borderBottom: shaded ? 'none' : `solid 1px ${COLORS.neutral['100']}`,
        ':last-of-type': {
          borderBottom: 'none'
        },
        paddingTop: SPACING['XL'],
        paddingBottom: SPACING['XL'],
        [MEDIA_QUERIES.LARGESCREEN]: {
          paddingTop: SPACING['3XL'],
          paddingBottom: SPACING['3XL'],
        }
      }}
      {...rest}
    >
      <Margins>
        {title && (<Heading level={2} size="L" css={{
          marginBottom: SPACING['XL']
        }}>{title}</Heading>)}
        {children}
      </Margins>
    </section>
  )
}

function PanelList({
  largeScreenTwoColumn,
  children,
  twoColumns,
  ...rest
}) {
  const panelListGridStyles = {
    [MEDIA_QUERIES.LARGESCREEN]: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gridGap: `${SPACING['XL']} ${SPACING['M']}`
    }
  }
  const panelListColumnStyles = {
    [MEDIA_QUERIES.LARGESCREEN]: {
      columns: '2',
      columnGap: SPACING['3XL'],
      '> li': {
        marginBottom: SPACING['XL']
      }
    }
  }

  return (
    <ol css={twoColumns ? panelListColumnStyles : panelListGridStyles}
      {...rest}
    >
      {children}
    </ol>
  )
}

function CardPanel({ data, headingLevel = 2 }) {
  const title = data.field_title
  const cards = data.relationships.field_cards
  const template = data.relationships.field_card_template.field_machine_name
  const noImage = template === 'standard_no_image'
  const useSummary = template !== 'address_and_hours'

  function getImage(image) {
    return !image || noImage
      ? null
      : image.relationships.field_media_image.localFile.childImageSharp.fluid
  }

  function renderCardChildren(data) {
    if (template === 'address_and_hours') {
      return (
        <React.Fragment>
          <div css={{
            display: 'flex',
            marginTop: SPACING['XS']
          }}>
            <span css={{
              color: COLORS.maize['500'],
              marginRight: SPACING['XS']
            }}>
              <Icon d={icons['address']} />
            </span>
            <Address data={data} />
          </div>
          <div css={{
            display: 'flex',
            marginTop: SPACING['XS']
          }}>
            <span css={{
              color: COLORS.maize['500'],
              marginRight: SPACING['XS']
            }}>
              <Icon d={icons['clock']} />
            </span>
            <Hours node={data} />
          </div>
        </React.Fragment>
      )
    }

    return null
  }
  

  return (
    <PanelTemplate
      title={title}
    >
      <PanelList twoColumns={noImage}>
        {cards.map((card, i) => (
          <li
            key={i + card.title}
            css={{
              marginBottom: SPACING['XL'],
              [MEDIA_QUERIES.LARGESCREEN]: {
                margin: '0'
              }
            }}
          >
            <Card
              image={card.relationships ? getImage(card.relationships.field_media_image) : null}
              href={card.fields.slug}
              title={card.title}
              children={
                useSummary ? card.body.summary : renderCardChildren(card)
              }
              css={{
                height: '100%'
              }}
            />
          </li>
        ))}
      </PanelList>
    </PanelTemplate>
  )
}

function TextPanel({ data }) {
  const title = data.field_title
  const template = data.relationships.field_text_template.field_machine_name
  const cards = data.relationships.field_text_card

  if (template === 'full_width_text_template') {
    const html = data.relationships.field_text_card[0].field_body.processed

    return (
      <PanelTemplate
        shaded
        css={{
          paddingTop: SPACING['3XL'],
          paddingBottom: SPACING['3XL'],
          [MEDIA_QUERIES.LARGESCREEN]: {
            paddingTop: SPACING['4XL'],
            paddingBottom: SPACING['4XL'],
          }
        }}
      >
        <div css={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div css={{
            textAlign: 'center',
            maxWidth: '38rem'
          }}>
            <Heading level={2} size="L" css={{
              marginBottom: SPACING['M']
            }}>{title}</Heading>
            <div css={{ color: COLORS.neutral['300'] }}>
              <HTML html={html} />
            </div>
          </div>
        </div>
      </PanelTemplate>
    )
  }

  if (template === 'grid_text_template_with_linked_title') {
    return (
      <PanelTemplate title={title}>
        <PanelList twoColumns={true}>
          {cards.map(({
            field_title,
            field_body,
            field_link
          }, i) => (
            <li
              key={i + field_title}
              css={{
                marginBottom: SPACING['XL'],
                [MEDIA_QUERIES.LARGESCREEN]: {
                  margin: '0'
                }
              }}
            >
              <div
                css={{
                  marginBottom: SPACING['XS']
                }}
              >
                <Link
                  to={field_link.uri}
                  kind="description"
                >
                  {field_title}
                </Link>
              </div>
              <div css={{ color: COLORS.neutral['300'] }}>
                <HTML html={field_body.processed} />
              </div>
            </li>
          ))}
        </PanelList>
      </PanelTemplate>
    )
  }

  return null
}

export default function Panels({ data }) {
  if (!data) {
    return null
  }

  return (
    <React.Fragment>
      {data.map(panel => {
        const type = panel.__typename
        const id = panel.id

        switch (type) {
          case 'paragraph__card_panel':
            return <CardPanel data={panel} key={id} />
          case 'paragraph__text_panel':
            return <TextPanel data={panel} key={id} />
          case 'paragraph__hours_panel':
            return <p>[Hours panel in development]</p>
          default:
            return null
        }
      })}
    </React.Fragment>
  )
}