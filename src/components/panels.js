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

function PanelTemplate({ title, children, shaded }) {
  return (
    <section css={{
      paddingTop: SPACING['3XL'],
      paddingBottom: SPACING['3XL'],
      borderBottom: shaded ? 'none' : `solid 1px ${COLORS.neutral['100']}`,
      background: shaded ? COLORS.blue['100'] : ''
    }}>
      <Margins>
        {title && (<Heading level={2} size="L" css={{
          marginBottom: SPACING['XL']
        }}>{title}</Heading>)}
        {children}
      </Margins>
    </section>
  )
}

function PanelList({ children, noImage }) {
  return (
    <ol css={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gridGap: noImage
        ? `${SPACING['M']} ${SPACING['3XL']}`
        : `${SPACING['XL']} ${SPACING['M']}`
    }}>
      {children}
    </ol>
  )
}

function CardPanel({ data }) {
  const title = data.field_title
  const cards = data.relationships.field_cards
  const template = data.relationships.field_card_template.field_machine_name
  const noImage = template === 'standard_no_image'
  const useSummary = template !== 'address_and_hours'

  function getImage(images) {
    return !images || noImage
      ? null
      : images[0].localFile.childImageSharp.fluid.src
  }

  function renderCardChildren(rest) {
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
          <Address
            data={rest.field_building_address}
          />
        </div>
      )
    }

    return null
  }
  

  return (
    <PanelTemplate title={title}>
      <PanelList noImage={noImage}>
        {cards.map(({ title, body, fields, relationships, ...rest }, i) => (
          <li
            css={{
              marginBottom: SPACING['S']
            }}
            key={i + title}
          >
            <Card
              image={relationships ? getImage(relationships.field_image) : null}
              href={fields.slug}
              title={title}
              children={
                useSummary ? body.summary : renderCardChildren(rest)
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
      <PanelTemplate shaded>
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
            <HTML html={html} />
          </div>
        </div>
      </PanelTemplate>
    )
  }

  if (template === 'grid_text_template_with_linked_title') {
    return (
      <PanelTemplate title={title}>
        <PanelList>
          {cards.map(({
            field_title,
            field_body,
            field_link
          }, i) => (
            <li
              css={{
                marginBottom: SPACING['S']
              }}
              key={i + field_title}
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
              <HTML html={field_body.processed} />
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