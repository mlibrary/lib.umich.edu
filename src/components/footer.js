import React from 'react'
import {
  COLORS,
  SPACING,
  Margins,
  Heading,
  MEDIA_QUERIES,
  Chat,
  SmallScreen,
  Icon
} from '@umich-lib/core'

import fdlp from '../images/fdlp.png'
import icons from '../reusable/icons'
import PlainLink from './plain-link'
import IconText from './icon-text'
import createGoogleMapsUrl from './utilities/create-google-maps-url'

const locationURL = createGoogleMapsUrl({
  query: "University of Michigan Library, 913 S. University Avenue, Ann Arbor, MI 48109"
})

const items = [
  {
    text: (
      <React.Fragment>
        913 S. University Avenue
        <br />
        Ann Arbor, MI 48109
      </React.Fragment>
    ),
    to: locationURL,
    d: icons['address']
  },
  {
    text: '(734) 764-0400',
    to: 'tel:+1-734-764-0400',
    d: icons['phone']
  },
  {
    text: 'Send us an email',
    to: '/ask-librarian',
    icon: 'email'
  },
  {
    text: 'Giving',
    to: '/about-us/give-library',
    icon: 'book'
  },
  {
    text: 'Accessibility',
    to: '/accessibility',
    icon: 'person'
  }
]

function Footer() {
  const now = new Date()
  const year = now.getFullYear()

  return (
    <footer
      css={{
        background: COLORS['neutral']['100'],
      }}
    >
      <Margins>
        <div
          css={{
            paddingTop: SPACING['2XL'],
            paddingBottom: SPACING['2XL'],
            [MEDIA_QUERIES.LARGESCREEN]: {
              paddingTop: SPACING['4XL'],
              paddingBottom: SPACING['3XL'],
              columns: '3',
              columnGap: SPACING['XL'],
              '& section': {
                breakInside: 'avoid',
                marginBottom: '0',
              },
            },
            '& section:not(:last-of-type)': {
              marginBottom: SPACING['XL'],
            },
            'a:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          <section>
            <Heading level={2} size="3XS">University of Michigan Library</Heading>
            <ul
              css={{
                paddingTop: SPACING['S']
              }}
            >
              {items.map(({ text, to, d, icon }, y) => {
                return (
                  <li key={y + to + text}>
                    <PlainLink to={to} css={{
                      display: 'inline-block',
                      padding: `${SPACING['XS']} 0`
                    }}>
                      <IconText icon={icon} d={d} >
                        {text}
                      </IconText>
                    </PlainLink>
                  </li>
                )
              })}
            </ul>
          </section>
          <section>
            <Heading level={2} size="3XS">Work with us</Heading>
            <p css={{
              paddingTop: SPACING['XS'],
              paddingBottom: SPACING['2XL']
            }}>
              <PlainLink to="/about-us/jobs-library" css={{
                display: 'inline-block',
                padding: `${SPACING['XS']} 0`
              }}>
                <IconText icon="close">
                  Jobs at the library
                </IconText>
              </PlainLink>
            </p>

            <Heading level={2} size="3XS">Connect with us</Heading>
            <p css={{
              paddingTop: SPACING['XS'],
            }}>
              <PlainLink to="/staff-directory" css={{
                display: 'inline-block',
                padding: `${SPACING['XS']} 0`
              }}>
                <IconText icon="person_outline">
                  Staff directory
                </IconText>
              </PlainLink>
            </p>
            <p css={{
              margin: `0 -${SPACING['S']}`,
              '> *': {
                display: 'inline-block',
                padding: SPACING['S']
              }
            }}>
              <a href="https://www.facebook.com/pages/University-of-Michigan-Library/110483979013559">
                <Icon title="Facebook" icon="facebook" size={24} />
              </a>
              <a href="https://twitter.com/umichlibrary">
                <Icon title="Twitter" icon="twitter" size={24} />
              </a>
              <a href="http://www.youtube.com/user/umlibrary/videos">
                <Icon title="YouTube" icon="youtube" size={24} />
              </a>
            </p>
          </section>
          <section css={{
            'a': {
              textDecoration: 'underline'
            },
            borderTop: `solid 1px ${COLORS.blue['200']}`,
            paddingTop: SPACING['XL'],
            [MEDIA_QUERIES.LARGESCREEN]: {
              border: '0',
              padding: '0',
              borderLeft: `solid 1px ${COLORS.blue['200']}`,
              paddingLeft: SPACING['XL'],
              marginLeft: `-${SPACING['2XL']}`
            }
          }}>
            <Heading level={2} size="3XS" css={{
              paddingBottom: SPACING['S']
            }}>Privacy and copyright</Heading>
            <PlainLink to="/about-us/policies/library-privacy-statement">Library Privacy Statement</PlainLink>
            <p css={{
              paddingTop: SPACING['S'],
              paddingBottom: SPACING['L'],
            }}>
              Except where otherwise noted, this work is subject to a <a href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 license</a>. For details and exceptions, see the <PlainLink to="/about-us/policies/copyright-policy">Library Copyright Policy</PlainLink>.
            </p>

            <p css={{
              display: 'flex'
            }}>
              <img src={fdlp} alt="" css={{ height: '2rem', marginRight: SPACING['S'] }} /><span>Federal Depository Library Program</span>
            </p>
          </section>
        </div>
      </Margins>
      <div
        css={{
          background: COLORS['blue']['200'],
          padding: `${SPACING['M']} 0`
        }}
      >
        <Margins>
          <span css={{
            marginRight: SPACING['2XL'],
            display: 'block',
            paddingBottom: SPACING['XS'],
            [MEDIA_QUERIES.LARGESCREEN]: {
              display: 'inline',
              padding: '0'
            }
          }}>© {year}, Regents of the University of Michigan</span>

          <span>Built with the <a href="https://design-system.lib.umich.edu/" css={{ textDecoration: 'underline' }}>U-M Library Design System</a></span>
        </Margins>
      </div>
    </footer>
  )
}

export default Footer
