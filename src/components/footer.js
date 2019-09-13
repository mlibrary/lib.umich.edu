import React from 'react'

import {
  COLORS,
  SPACING,
  Margins,
  Heading,
  MEDIA_QUERIES,
  Chat,
  SmallScreen,
} from '@umich-lib/core'

import Link from './link'

function FooterHeading(props) {
  return (
    <Heading
      level={2}
      size="3XS"
      css={{
        color: COLORS.blue['200'],
      }}
      {...props}
    />
  )
}

function Footer() {
  const now = new Date()
  const year = now.getFullYear()

  return (
    <footer
      css={{
        background: COLORS['blue']['400'],
      }}
    >
      <Margins>
        <div
          css={{
            [MEDIA_QUERIES.LARGESCREEN]: {
              columns: '2',
              columnGap: SPACING['3XL'],
              '& section': {
                breakInside: 'avoid',
                marginBottom: '0',
              },
            },
            color: 'white',
            padding: `${SPACING['3XL']} 0`,
            '& section:not(:last-of-type)': {
              marginBottom: SPACING['XL'],
            },
          }}
        >
          <section>
            <FooterHeading>University of Michigan Library</FooterHeading>
            <address
              css={{
                marginTop: SPACING['2XS'],
              }}
            >
              <p>
                913 S. University Avenue
                <br />
                Ann Arbor, MI 48109
              </p>
            </address>
            <p>
              <Link kind="light" to="tel:+1-734-764-0400">
                (734) 764-0400
              </Link>
            </p>
            <p>
              <Link kind="light" to="/">
                Send us an email
              </Link>
            </p>
            <SmallScreen
              css={{
                marginTop: SPACING['L'],
              }}
            >
              <Chat />
            </SmallScreen>
          </section>
          <section>
            <FooterHeading>Privacy and copyright</FooterHeading>

            <p>
              Library Privacy Statement
              <br />
              Except where otherwise noted, this work is subject to a Creative
              Commons Attribution 4.0 license. For details and exceptions, see
              the Library Copyright Policy.
            </p>
          </section>
        </div>
      </Margins>
      <div
        css={{
          color: COLORS['blue']['200'],
          background: COLORS['blue']['500'],
          padding: `${SPACING['XS']} 0`,
        }}
      >
        <Margins>
          <p>©{year}, Regents of the University of Michigan</p>
        </Margins>
      </div>
    </footer>
  )
}

export default Footer
