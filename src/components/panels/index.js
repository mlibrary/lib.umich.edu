import React from 'react'
import {
  Heading,
  SPACING,
  COLORS
} from '@umich-lib/core'

import HTML from '../html'
import Card from '../card'

function PanelTemplate({ title, children }) {
  return (
    <section css={{
      marginTop: SPACING['3XL'],
      paddingTop: SPACING['3XL'],
      paddingBottom: SPACING['M'],
      marginBottom: SPACING['3XL'],
      borderTop: `solid 1px ${COLORS.neutral['100']}`
    }}>
      {title && (<Heading level={2} size="L">{title}</Heading>)}
      {children}
    </section>
  )
}

function PanelList({ children }) {
  return (
    <ol css={{
      marginTop: SPACING['L'],
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gridGap: SPACING['2XL']
    }}>
      {children}
    </ol>
  )
}

function CardPanel({ data }) {
  const title = data.field_title
  const cards = data.relationships.field_cards

  function getImage(images) {
    return !images
      ? null
      : images[0].localFile.childImageSharp.fluid
  }

  return (
    <PanelTemplate title={title}>
      <PanelList>
        {cards.map(({ title, body, fields, relationships }) => (
          <li>
            <Card
              image={getImage(relationships.field_image)}
              to={fields.slug}
              title={title}
              description={body.summary}
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

  if (template === 'full_width_text_template') {
    const html = data.relationships.field_text_card[0].field_body.processed

    return (
      <PanelTemplate>
        <div css={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div css={{
            textAlign: 'center',
            maxWidth: '28rem'
          }}>
            <Heading level={2} size="L" css={{
              marginBottom: SPACING['L']
            }}>{title}</Heading>
            <HTML html={html} />
          </div>
        </div>
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