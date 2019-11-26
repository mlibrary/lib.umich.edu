import React from 'react'
import { Link } from 'gatsby'
import { Margins, COLORS, SPACING, LINK_STYLES, Icon } from '@umich-lib/core'

import Nav from './primary-nav'
import Logo from './logo'
import SiteSearch from '../site-search'

export default ({ primary, secondary }) => (
  <header
    css={{
      borderBottom: `solid 1px ${COLORS.neutral[100]}`,
    }}
  >
    <Margins>
      <div
        css={{
          paddingTop: SPACING['M'],
          position: 'relative',
        }}
      >
        <Logo size={36} />

        <div
          css={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginTop: SPACING['XS'],
          }}
        >
          <Nav items={primary} />
          {secondary && (
            <nav
              css={{
                position: 'absolute',
                top: SPACING['M'],
                right: '0',
              }}
              aria-label="Utility"
            >
              <ul>
                {secondary.map(({ text, to, icon }, i) => (
                  <li
                    css={{
                      display: 'inline-block',
                      ':not(:last-child)': {
                        marginRight: SPACING['L'],
                      },
                    }}
                    key={i + text}
                  >
                    <Link
                      to={to}
                      css={{
                        ...LINK_STYLES['special'],
                        padding: `${SPACING['S']} 0`,
                        ':hover': {
                          '.text': LINK_STYLES['special'][':hover'],
                        },
                      }}
                    >
                      {icon && (
                        <Icon
                          icon={icon}
                          size={14}
                          css={{
                            marginRight: SPACING['2XS'],
                            marginTop: '-2px',
                          }}
                        />
                      )}
                      <span className="text">{text}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <div
            css={{
              flexBasis: '20rem',
              marginBottom: SPACING['M'],
            }}
          >
            <SiteSearch />
          </div>
        </div>
      </div>
    </Margins>
  </header>
)
