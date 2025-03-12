import { Heading, Icon, MEDIA_QUERIES, SPACING, TYPOGRAPHY } from '../../reusable';
import React, { useEffect, useState } from 'react';
import { displayHours } from '../../utils/hours';
import { Link as GatsbyLink } from 'gatsby';
import Link from '../link';
import PropTypes from 'prop-types';

const processHoursData = (data, initialized) => {
  const hours = (node) => {
    if (initialized) {
      const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
      return displayHours({ node, now });
    }

    return { label: 'Loading hours... ', text: '...' };
  };

  const result = data.map((node) => {
    const hoursData = hours(node);
    const { text, label } = hoursData || {
      label: 'n/a',
      text: 'n/a'
    };

    return {
      isOpen: hoursData.isOpen,
      subLabel: `TODAY: ${label}`,
      subText: `TODAY: ${text}`,
      text: node.title,
      to: node.fields.slug
    };
  });

  return result;
};

export default function HoursLitePanel ({ data }) {
  const [initialized, setInitialized] = useState(false);
  const { field_title: fieldTitle } = data;
  const hours = processHoursData(data.relationships.field_cards, initialized);

  useEffect(() => {
    setInitialized(true);
  }, []);

  return (
    <section>
      <Heading level={2} size='M'>
        {fieldTitle}
      </Heading>

      <ol
        css={{
          marginTop: SPACING.L
        }}
      >
        {hours.map((hour, item) => {
          return (
            <li
              key={item + hour.text + hour.to}
              css={{
                display: 'flex'
              }}
            >
              <span
                css={{
                  color: 'var(--color-indigo-300)',
                  display: 'inline',
                  flexShrink: '0',
                  width: '1.5rem'
                }}
              >
                <Icon icon='access_time' />
              </span>
              <GatsbyLink
                to={hour.to}
                css={{
                  ':hover span': {
                    textDecoration: 'underline'
                  },
                  flex: '1',
                  paddingBottom: `${SPACING.S}`
                }}
              >
                <span>
                  <span
                    data-text
                    css={{
                      display: 'block',
                      [MEDIA_QUERIES.M]: {
                        display: 'inline-block',
                        marginRight: SPACING.XS
                      }
                    }}
                  >
                    {hour.text}
                  </span>
                  <span
                    css={{
                      display: 'inline-block',
                      marginTop: SPACING['3XS'],
                      [MEDIA_QUERIES.M]: {
                        display: 'inline-block',
                        marginTop: '0'
                      },
                      ...TYPOGRAPHY['3XS'],
                      color: 'var(--color-neutral-300)',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      textTransform: 'uppercase'
                    }}
                  >
                    {hour.subText}
                  </span>
                </span>
              </GatsbyLink>
            </li>
          );
        })}
        <li>
          <Link
            to='/locations-and-hours/hours-view'
            css={{
              marginLeft: '1.5rem'
            }}
          >
            View all hours, locations, and access details
          </Link>
        </li>
      </ol>
    </section>
  );
}

HoursLitePanel.propTypes = {
  data: PropTypes.object
};

/*
 *Const hoursDataExample = [
 *  {
 *    text: 'Hatcher Library',
 *    subText: 'Today: 8AM - 7PM',
 *    to: '/'
 *  },
 *  {
 *    text: 'Shapiro Library',
 *    subText: 'Today: Open 24 hours',
 *    to: '/'
 *  },
 *  {
 *    text: 'Art, Architecture & Engineering Library',
 *    subText: 'Today: 7AM - 11PM',
 *    to: '/'
 *  },
 *  {
 *    text: 'Taubman Health Sciences Library',
 *    subText: 'Today: 6AM - 11PM',
 *    to: '/'
 *  }
 *]
 */
