import { COLORS, Icon, LINK_STYLES, Margins, SPACING } from '../../reusable';

import Logo from './logo';
import Nav from './primary-nav';
import PlainLink from '../plain-link';
import PropTypes from 'prop-types';
import React from 'react';
import SiteSearch from '../site-search';

const HeaderLargeScreen = ({ primary, secondary }) => {
  return (
    <header
      css={{
        '@media only screen and (max-width: 1128px)': {
          display: 'none'
        },
        borderBottom: `solid 2px ${COLORS.neutral[100]}`,
        display: 'block'
      }}
    >
      <Margins>
        <div
          css={{
            paddingTop: SPACING.M,
            position: 'relative'
          }}
        >
          <Logo size={36} />

          <div
            css={{
              alignItems: 'flex-end',
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: SPACING.XS
            }}
          >
            <Nav items={primary} />
            {secondary && (
              <nav
                css={{
                  position: 'absolute',
                  right: '0',
                  top: SPACING.M
                }}
                aria-label='Utility'
              >
                <ul>
                  {secondary.map(({ text, to, icon }, iterator) => {
                    return (
                      <li
                        css={{
                          ':not(:last-child)': {
                            marginRight: SPACING.M
                          },
                          display: 'inline-block'
                        }}
                        key={iterator + text}
                      >
                        <PlainLink
                          to={to}
                          external={to === '/my-account'}
                          css={{
                            ...LINK_STYLES.special,
                            ':hover': {
                              '.text': LINK_STYLES.special[':hover']
                            },
                            padding: `${SPACING.S} 0`
                          }}
                        >
                          {icon && (
                            <Icon
                              icon={icon}
                              size={14}
                              css={{
                                marginRight: SPACING['2XS'],
                                marginTop: '-2px'
                              }}
                            />
                          )}
                          <span className='text'>{text}</span>
                        </PlainLink>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            )}
            <div
              css={{
                flexBasis: '21rem',
                marginBottom: SPACING.M
              }}
            >
              <SiteSearch label='Search this site' />
            </div>
          </div>
        </div>
      </Margins>
    </header>
  );
};

HeaderLargeScreen.propTypes = {
  primary: PropTypes.array,
  secondary: PropTypes.array
};

export default HeaderLargeScreen;
