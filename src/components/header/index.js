import HeaderLargeScreen from './header-largescreen';
import HeaderSmallScreen from './header-smallscreen';
import { Icon, LINK_STYLES, SPACING } from '../../reusable';
import PlainLink from '../plain-link';
import PropTypes from 'prop-types';
import React from 'react';

const Header = ({ primary, secondary }) => {
  return (
    <React.Fragment>
      <m-website-header variant='dark'>
        <nav>
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
      </m-website-header>
      <m-website-header>
        <nav>
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
      </m-website-header>
      <HeaderSmallScreen primary={primary} secondary={secondary} />
      <HeaderLargeScreen primary={primary} secondary={secondary} />
    </React.Fragment>
  );
};

Header.propTypes = {
  primary: PropTypes.array,
  secondary: PropTypes.array
};

export default Header;
