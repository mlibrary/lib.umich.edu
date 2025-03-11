import { Heading, Margins, MEDIA_QUERIES, SPACING } from '../reusable';
import createGoogleMapsUrl from './utilities/create-google-maps-url';
import fdlp from '../images/fdlp.png';
import IconText from './icon-text';
import PlainLink from './plain-link';
import React from 'react';

const locationURL = createGoogleMapsUrl({
  query:
    'University of Michigan Library, 913 S. University Avenue, Ann Arbor, MI 48109'
});

const links = [
  {
    heading: 'University of Michigan Library',
    links: [
      {
        icon: 'address',
        text: (
          <>
            913 S. University Avenue
            <br />
            Ann Arbor, MI 48109-1190
          </>
        ),
        to: locationURL
      },
      {
        icon: 'phone',
        text: '(734) 764-0401',
        to: 'tel:+1-734-764-0401'
      },
      {
        icon: 'mail_outline',
        text: 'Send us an email',
        to: 'https://teamdynamix.umich.edu/TDClient/88/Portal/Requests/TicketRequests/NewForm?ID=1751&RequestorType=Service'
      },
      {
        icon: 'accessible_forward',
        text: 'Accessibility',
        to: '/about-us/about-library/diversity-equity-inclusion-and-accessibility/accessibility'
      },
      {
        icon: 'map',
        text: 'Site map',
        to: '/site-map'
      }
    ]
  },
  {
    heading: 'Our community',
    links: [
      {
        icon: 'people_outline',
        text: 'Staff directory',
        to: '/about-us/staff-directory'
      },
      {
        icon: 'work',
        text: 'Work for us',
        to: '/about-us/work-us'
      },
      {
        icon: 'blog',
        text: 'Blogs',
        to: 'https://apps.lib.umich.edu/blogs'
      },
      {
        icon: 'facebook',
        text: 'Facebook',
        to: 'https://www.facebook.com/pages/University-of-Michigan-Library/110483979013559'
      },
      {
        icon: 'twitter',
        text: 'X (formerly Twitter)',
        to: 'https://twitter.com/umichlibrary'
      },
      {
        icon: 'youtube',
        text: 'YouTube',
        to: 'http://www.youtube.com/user/umlibrary/videos'
      }
    ]
  }
];

const Footer = () => {
  const year = new Date(new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' })).getFullYear();

  return (
    <footer
      css={{
        '*:focus': {
          outlineColor: 'white'
        },
        background: 'var(--color-blue-400)'
      }}
      role='contentinfo'
    >
      <Margins
        css={{
          color: 'white'
        }}
      >
        <div
          css={{
            '& section:not(:last-of-type)': {
              marginBottom: SPACING.XL
            },
            'a:hover': {
              textDecoration: 'underline'
            },
            'h2, h3': {
              color: 'var(--color-blue-200)'
            },
            paddingBottom: SPACING.L,
            paddingTop: SPACING['2XL'],
            [MEDIA_QUERIES.S]: {
              '& section': {
                breakInside: 'avoid',
                marginBottom: '0'
              },
              columnGap: SPACING.XL,
              columns: '3',
              paddingTop: SPACING['3XL']
            }
          }}
        >
          {links.map((section) => {
          /* eslint-disable id-length */
          // Disabling because eslint is picking things up like "a" for anchor emotion css styles
            return (
              <section key={section.heading}>
                <Heading level={2} size='3XS'>
                  {section.heading}
                </Heading>
                <nav aria-label={`${section.heading} links`}>
                  <ul
                    css={{
                      paddingTop: SPACING.S
                    }}
                  >
                    {section.links.map(({ text, to, data: d, icon }, index) => {
                      return (
                        <li key={index + to + text}>
                          <PlainLink
                            to={to}
                            css={{
                              display: 'inline-block',
                              padding: `${SPACING.XS} 0`
                            }}
                          >
                            <IconText icon={icon} d={d}>
                              {text}
                            </IconText>
                          </PlainLink>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </section>
            );
          })}
          <section
            css={{
              a: {
                textDecoration: 'underline'
              },
              borderTop: `solid 1px var(--color-blue-300)`,
              paddingTop: SPACING.XL,
              [MEDIA_QUERIES.S]: {
                border: '0',
                borderLeft: `solid 1px var(--color-blue-300)`,
                marginLeft: `-${SPACING['2XL']}`,
                padding: '0',
                paddingLeft: SPACING.XL
              }
            }}
          >
            <Heading
              level={2}
              size='3XS'
              css={{
                paddingBottom: SPACING.S
              }}
            >
              Privacy and copyright
            </Heading>
            <PlainLink to='/about-us/policies/library-privacy-statement'>
              Library Privacy Statement
            </PlainLink>
            <p
              css={{
                paddingBottom: SPACING.L,
                paddingTop: SPACING.S
              }}
            >
              Except where otherwise noted, this work is subject to a
              {' '}
              <a href='http://creativecommons.org/licenses/by/4.0/'>
                Creative Commons Attribution 4.0 license
              </a>
              . For details and exceptions, see the
              {' '}
              <PlainLink to='/about-us/policies/copyright-policy'>
                Library Copyright Policy
              </PlainLink>
              .
            </p>

            <p
              css={{
                display: 'flex'
              }}
            >
              <img
                src={fdlp}
                alt=''
                css={{ height: '2rem', marginRight: SPACING.S }}
              />
              <span>Federal Depository Library Program</span>
            </p>
          </section>
        </div>
      </Margins>
      <div
        css={{
          background: 'var(--color-blue-500)',
          color: 'var(--color-blue-200)',
          padding: `${SPACING.M} 0`
        }}
      >
        <Margins>
          <nav aria-label='Legal and References'>
            <ul
              css={{
                display: 'flex',
                flexWrap: 'wrap',
                listStyle: 'none'
              }}
            >
              <li
                css={{
                  marginBottom: [SPACING.XS],
                  marginRight: [SPACING.XL],
                  marginTop: [SPACING.XS]
                }}
              >
                © {year}, Regents of the University of Michigan
              </li>

              <li
                css={{
                  marginBottom: [SPACING.XS],
                  marginRight: [SPACING.XL],
                  marginTop: [SPACING.XS]
                }}
              >
                <a
                  href='/about-us/about-library/territorial-acknowledgement'
                  css={{ textDecoration: 'underline' }}
                >
                  Territorial Acknowledgement
                </a>
              </li>

              <li
                css={{
                  marginBottom: [SPACING.XS],
                  marginRight: [SPACING.XL],
                  marginTop: [SPACING.XS]
                }}
              >
                Built with the
                {' '}
                <a
                  href='https://design-system.lib.umich.edu/'
                  css={{ textDecoration: 'underline' }}
                >
                  U-M Library Design System
                </a>
              </li>
            </ul>
          </nav>
        </Margins>
      </div>
    </footer>
  );
};

export default Footer;
