import React from 'react'
import { StaticQuery, Link } from 'gatsby'
import {
  Margins,
  COLORS,
  SPACING,
  TYPOGRAPHY,
  TextInput,
  Button,
  Icon
} from '@umich-lib/core'

import Nav from './primary-nav'
import Logo from './logo'
import Search from './search'

export default ({ primary, secondary }) => (
  <header css={{
    borderBottom: `solid 1px ${COLORS.neutral[100]}`
  }}>
    <Margins>
      <div css={{
        paddingTop: SPACING['M'],
        position: 'relative',
      }}>
        <Logo size={36} />

        <div css={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end'
        }}>
          <Nav
            items={primary}
          />
          {secondary && (
            <ul css={{
              position: 'absolute',
              top: SPACING['M'],
              right: '0'
            }}>
              {secondary.map(({ text, to }, i) => (
                <li css={{
                    display: 'inline-block',
                    ':not(:last-child)': {
                      marginRight: SPACING['L']
                    }
                  }}
                  key={i + text}
                >
                  <Link
                    to={to}
                    css={{
                      ...TYPOGRAPHY['3XS'],
                      color: COLORS.neutral['300'],
                      textDecoration: 'none',
                      padding: `${SPACING['XS']} 0`
                    }}
                  >{text}</Link>
                </li>
              ))}
            </ul>
          )}
          <div css={{
            maxWidth: '18rem',
            marginBottom: SPACING['M']
          }}>
            <Search />
          </div>
        </div>
      </div>
    </Margins>
  </header>
)