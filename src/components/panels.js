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

function PanelTemplate({ title, children, shaded, ...rest }) {
  return (
    <section
      css={{
        background: shaded ? COLORS.blue['100'] : '',
        borderBottom: shaded ? 'none' : `solid 1px ${COLORS.neutral['100']}`,
        ':last-of-type': {
          borderBottom: 'none'
        },
        ':first-of-type': {
          borderTop: shaded ? 'none' : `solid 1px ${COLORS.neutral['100']}`,
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
  ...rest
}) {
  return (
      <ol css={{
        [MEDIA_QUERIES.LARGESCREEN]: {
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gridGap: `${SPACING['XL']} ${SPACING['M']}`
        }
      }}
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
      : image.relationships.field_media_image.localFile.childImageSharp.fluid.src
  }

  function renderCardChildren(data) {
    if (template === 'address_and_hours') {
      return (
        <div css={{
          display: 'flex',
          marginTop: SPACING['XS']
        }}>
          <span css={{
            color: COLORS.maize['500'],
            marginRight: SPACING['2XS']
          }}>
            <Icon d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </span>
          <Address data={data} />
        </div>
      )
    }

    return null
  }
  

  return (
    <PanelTemplate
      title={title}
    >
      <PanelList>
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
        <PanelList
          css={{
            [MEDIA_QUERIES.LARGESCREEN]: {
              gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))'
            }
          }}
        >
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

        return type === 'paragraph__card_panel'
          ? <CardPanel data={panel} key={id} />
          : <TextPanel data={panel} key={id} />
      })}
    </React.Fragment>
  )
}