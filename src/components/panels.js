import React from 'react'
import {
  Heading,
  SPACING,
  COLORS,
  Margins
} from '@umich-lib/core'

import HTML from './html'
import Card from './card'

function PanelTemplate({ title, children, shaded }) {
  return (
    <section css={{
      paddingTop: SPACING['3XL'],
      paddingBottom: SPACING['3XL'],
      borderTop: shaded ? 'none' : `solid 1px ${COLORS.neutral['100']}`,
      background: shaded ? COLORS.blue['100'] : ''
    }}>
      <Margins>
        {title && (<Heading level={2} size="L">{title}</Heading>)}
        {children}
      </Margins>
    </section>
  )
}

function PanelList({ children, noImage }) {
  return (
    <ol css={{
      marginTop: SPACING['L'],
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gridGap: noImage ? `${SPACING['M']} ${SPACING['3XL']}` : SPACING['M']
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

  function getImage(images) {
    return !images || noImage
      ? null
      : images[0].localFile.childImageSharp.fluid
  }

  return (
    <PanelTemplate title={title}>
      <PanelList noImage={noImage}>
        {cards.map(({ title, body, fields, relationships }) => (
          <li css={{
            marginBottom: SPACING['S']
          }}>
            <Card
              image={relationships ? getImage(relationships.field_image) : null}
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
      <PanelTemplate shaded>
        <div css={{
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div css={{
            textAlign: 'center',
            maxWidth: '28rem'
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