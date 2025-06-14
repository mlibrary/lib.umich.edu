import {
  Heading,
  Icon,
  Margins,
  MEDIA_QUERIES,
  SPACING
} from '../../reusable';
import Address from '../address';
import Callout from '../../reusable/callout';
import Card from '../card';
import CustomPanel from './custom-panel';
import DestinationHorizontalPanel from './destination-horizontal-panel';
import DotsSvg from '../dots-svg';
import getParentTitle from '../../utils/get-parent-title';
import GroupPanel from './group-panel';
import HeroPanel from './hero-panel';
import Hours from '../todays-hours';
import HoursLitePanel from './hours-lite-panel';
import HoursPanel from './hours-panel';
import HoursPanelDateViewer from './hours-panel-date-viewer';
import Html from '../html';
import Image from '../image';
import Link from '../link';
import LinkPanel from './link-panel';
import PropTypes from 'prop-types';
import React from 'react';

import { StateProvider } from '../use-state';

const PanelTemplate = ({ title, children, shaded, headingCss, ...rest }) => {
  return (
    <section
      data-can-be-shaded={shaded}
      data-panel
      css={{
        ':not(:last-of-type)': {
          borderBottom: shaded ? 'none' : `solid 1px var(--color-neutral-100)`,
          paddingBottom: SPACING['3XL']
        },
        background: shaded ? 'var(--color-blue-100)' : '',
        paddingBottom: SPACING.XL,
        paddingTop: SPACING.XL,
        [MEDIA_QUERIES.S]: {
          paddingBottom: SPACING['3XL'],
          paddingTop: SPACING['3XL']
        }
      }}
      {...rest}
    >
      <Margins data-panel-margins>
        {title && (
          <Heading
            level={2}
            size='M'
            css={{
              marginBottom: SPACING.XL,
              ...headingCss
            }}
          >
            {title}
          </Heading>
        )}
        {children}
      </Margins>
    </section>
  );
};

PanelTemplate.propTypes = {
  children: PropTypes.any,
  headingCss: PropTypes.object,
  shaded: PropTypes.bool,
  title: PropTypes.string
};

const PanelList = ({ children, twoColumns, disableLargeScreenStyles = false, ...rest }) => {
  const panelListGridStyles = disableLargeScreenStyles
    ? {}
    : {
        [MEDIA_QUERIES.S]: {
          display: 'grid',
          gridGap: `${SPACING.XL} ${SPACING.M}`,
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))'
        }
      };
  const panelListColumnStyles = {
    [MEDIA_QUERIES.S]: {
      columnGap: SPACING['3XL'],
      columns: '2'
    },
    '> li': {
      breakInside: 'avoid',
      marginBottom: 0,
      marginTop: SPACING.XL
    },
    '> li:first-of-type': {
      marginTop: 0
    }
  };

  return (
    <ol
      css={twoColumns ? panelListColumnStyles : panelListGridStyles}
      {...rest}
    >
      {children}
    </ol>
  );
};

PanelList.propTypes = {
  children: PropTypes.any,
  disableLargeScreenStyles: PropTypes.bool,
  mediumBreakPoint: PropTypes.bool,
  twoColumns: PropTypes.bool
};

const CardPanel = ({ data }) => {
  const template = data.relationships.field_card_template.field_machine_name;

  if (template === 'destination_hor_card_template') {
    return <DestinationHorizontalPanel data={data} />;
  }

  const title = data.field_title;
  const cards = data.relationships.field_cards;
  const noImage = template === 'standard_no_image';
  const useSummary = template !== 'address_and_hours';

  const getCardSubtitle = (card) => {
    if (template === 'destination_card_template') {
      return getParentTitle({ node: card });
    }

    return null;
  };

  const getImage = (image) => {
    return !image || noImage
      ? null
      : image.relationships.field_media_image.localFile.childImageSharp
        .gatsbyImageData;
  };

  const getCardHref = (card) => {
    if (card.field_url) {
      return card.field_url.uri;
    }

    return card.fields.slug;
  };

  const getSummary = (body) => {
    return body ? body.summary : null;
  };

  const renderCardChildren = (dataRenderCardChildren) => {
    if (template === 'address_and_hours') {
      return (
        <>
          <div
            css={{
              display: 'flex',
              marginTop: SPACING.XS
            }}
          >
            <span
              css={{
                color: 'var(--color-indigo-300)',
                marginRight: SPACING.XS
              }}
            >
              <Icon icon='address' />
            </span>
            <Address node={dataRenderCardChildren} />
          </div>
          <div
            css={{
              display: 'flex',
              marginTop: SPACING.XS
            }}
          >
            <span
              css={{
                color: 'var(--color-indigo-300)',
                marginRight: SPACING.XS
              }}
            >
              <Icon icon='access_time' />
            </span>
            <Hours node={dataRenderCardChildren} />
          </div>
        </>
      );
    }

    return null;
  };
  if (template === 'highlights') {
    return (
      <Margins>
        <section
          css={{
            backgroundColor: 'var(--color-blue-300)',
            paddingBottom: SPACING.XL,
            paddingTop: SPACING.XL,
            [MEDIA_QUERIES.S]: {
              paddingBottom: `${SPACING['2XL']}`,
              paddingTop: `${SPACING.L}`
            }
          }}
        >
          <Margins data-panel-margins>
            <div css={{
              [MEDIA_QUERIES.L]: {
                alignItems: 'center',
                flexDirection: 'row'
              },
              display: 'flex',
              flexDirection: 'column',
              marginBottom: `${SPACING.L}`
            }}
            >
              <div css={{
                [MEDIA_QUERIES.L]: {
                  display: 'flex',
                  height: '2.5rem',
                  marginLeft: '-30px',
                  maxWidth: '144px'
                },
                display: 'none'
              }}
              >
                <DotsSvg />
              </div>
              <Heading
                level={2}
                size='M'
                css={{
                  [MEDIA_QUERIES.L]: {
                    marginLeft: '1rem'
                  },
                  color: 'white',
                  fontFamily: 'Crimson Text',
                  fontSize: '2.5rem',
                  fontWeight: '300'
                }}
              >
                {title}
              </Heading>
            </div>
            <PanelList
              disableLargeScreenStyles={true}
              css={{
                [MEDIA_QUERIES.L]: {
                  display: 'grid',
                  gridGap: `${SPACING.M}`,
                  gridTemplateColumns: 'repeat(10, auto)'
                }
              }}
            >

              {cards.map((card, item) => {
                const columnGaps = [5, 4, 1, 4, 5];
                return (
                  <li
                    key={item + card.title}
                    css={{
                      [MEDIA_QUERIES.L]: {
                        gridColumn: `span ${columnGaps[item]}`,
                        ...(item === 2 && { gridRow: 'span 2' }),
                        ...(item === 2 && { columnGap: '0' }),
                        marginBottom: '0'
                      },
                      background: '#fff',
                      border: '1px solid var(--color-blue-200)',
                      borderRadius: '8px',
                      marginBottom: SPACING.L,
                      minHeight: '0'
                    }}
                  >
                    <Card
                      href={getCardHref(card)}
                      subtitle={getCardSubtitle(card)}
                      headingLevel={title ? 3 : 2}
                      title={card.title}
                      css={{
                        height: '100%'
                      }}
                      anchorStyleAddition={{
                        height: '100%',
                        padding: SPACING.M
                      }}
                    >
                      {useSummary ? getSummary(card.body) : renderCardChildren(card)}
                    </Card>
                  </li>
                );
              })}
            </PanelList>
          </Margins>
        </section>
      </Margins>
    );
  }

  return (
    <PanelTemplate title={title}>
      <PanelList twoColumns={noImage}>
        {cards.map((card, item) => {
          return (
            <li
              key={item + card.title}
              css={{
                ':first-of-type': {
                  marginTop: 0
                },
                marginTop: SPACING.XL,
                [MEDIA_QUERIES.S]: {
                  margin: '0'
                }
              }}
            >
              <Card
                image={
                  card.relationships
                    ? getImage(card.relationships.field_media_image)
                    : null
                }
                href={getCardHref(card)}
                subtitle={getCardSubtitle(card)}
                headingLevel={title ? 3 : 2}
                title={card.title}
                css={{
                  height: '100%'
                }}
              >
                {useSummary ? getSummary(card.body) : renderCardChildren(card)}
              </Card>
            </li>
          );
        })}
      </PanelList>
    </PanelTemplate>
  );
};

CardPanel.propTypes = {
  data: PropTypes.any
};

const MarginsWrapper = ({ useMargins = false, children }) => {
  if (useMargins) {
    return <Margins>{children}</Margins>;
  }

  return children;
};

MarginsWrapper.propTypes = {
  children: PropTypes.any,
  useMargins: PropTypes.bool
};

const TextPanel = ({ data }) => {
  const title = data.field_title;
  const placement = data.field_placement;
  const template = data.relationships.field_text_template.field_machine_name;
  const cards = data.relationships.field_text_card;

  if (template === 'callout') {
    return (
      <MarginsWrapper useMargins={placement !== 'body'}>
        <Callout
          intent='warning'
          css={{
            maxWidth: placement === 'body' ? '38rem' : '100%'
          }}
        >
          <Heading
            level={2}
            size='M'
            css={{
              marginBottom: SPACING.XS
            }}
          >
            {title}
          </Heading>

          <Html
            html={cards[0].field_body.processed}
            css={{
              '> *': {
                maxWidth: placement === 'body' ? '38rem' : '100%'
              }
            }}
          />
        </Callout>
      </MarginsWrapper>
    );
  }

  if (template === 'body_width_text' || template === 'text_group') {
    const hasTopBorder = data.field_border === 'yes';
    const hasMarginTop = template === 'body_width_text';
    const useMargins = placement !== 'body' && template === 'body_width_text';

    return (
      <MarginsWrapper useMargins={useMargins}>
        <div
          css={{
            marginTop: hasMarginTop ? SPACING.XL : 0
          }}
        >
          {cards.map((card, index) => {
            return (
              <section
                key={`section-${index}`}
                css={{
                  borderTop: hasTopBorder
                    ? `solid 1px var(--color-neutral-100)`
                    : 'none',
                  paddingTop: hasTopBorder ? SPACING.XL : 0
                }}
              >
                <Heading
                  level={2}
                  size='M'
                  css={{
                    marginBottom: SPACING.L
                  }}
                >
                  {title}
                </Heading>
                <Html html={card.field_body.processed} />
              </section>
            );
          })}
        </div>
      </MarginsWrapper>
    );
  }

  if (template === 'full_width_text_template') {
    const html = data.relationships.field_text_card[0].field_body.processed;

    return (
      <PanelTemplate
        shaded
        css={{
          paddingBottom: SPACING['3XL'],
          paddingTop: SPACING['3XL'],
          [MEDIA_QUERIES.S]: {
            paddingBottom: SPACING['4XL'],
            paddingTop: SPACING['4XL']
          }
        }}
      >
        <div
          css={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <div
            css={{
              maxWidth: '38rem',
              textAlign: 'center'
            }}
          >
            <Heading
              level={2}
              size='M'
              css={{
                marginBottom: SPACING.M
              }}
            >
              {title}
            </Heading>
            <div css={{ color: 'var(--color-neutral-300)' }}>
              <Html html={html} />
            </div>
          </div>
        </div>
      </PanelTemplate>
    );
  }

  if (template === 'grid_text_template_with_linked_title') {
    return (
      <PanelTemplate title={title}>
        <PanelList twoColumns>
          {cards.map(({ field_title: fieldTitle, field_body: fieldBody, field_link: fieldLink }, item) => {
            return (
              <li
                key={item + fieldTitle}
                css={{
                  [MEDIA_QUERIES.S]: {
                    margin: '0'
                  }
                }}
              >
                <div
                  css={{
                    marginBottom: SPACING.XS
                  }}
                >
                  <Link to={fieldLink[0].uri} kind='description'>
                    {fieldTitle}
                  </Link>
                </div>
                <div css={{ color: 'var(--color-neutral-300)' }}>
                  <Html html={fieldBody.processed} />
                </div>
              </li>
            );
          })}
        </PanelList>
      </PanelTemplate>
    );
  }

  if (template === 'image_text_body') {
    const items = cards.map((card) => {
      return {
        heading: card.field_title,
        html: card.field_body.processed,
        image:
          card.relationships.field_text_image.relationships.field_media_image
            .localFile.childImageSharp.gatsbyImageData,
        imageAlt:
          card.relationships.field_text_image.relationships.field_media_image
            .relationships?.media__image[0]?.field_media_image.alt
      };
    });

    return (
      <PanelTemplate title={title}>
        {items.map(({ heading, html, image, imageAlt }, item) => {
          return (
            <section
              key={item + html}
              css={{
                '& + &': {
                  borderTop: 'solid 1px var(--color-neutral-100)',
                  marginTop: SPACING.M,
                  paddingTop: SPACING.L
                },
                display: 'flex'
              }}
            >
              <div
                css={{
                  flexShrink: '0',
                  marginRight: SPACING.L,
                  width: '8rem'
                }}
              >
                <Image image={image} alt={imageAlt} />
              </div>
              <div>
                {heading && (
                  <Heading
                    // Use heading level 3 if has (h2) panel title.
                    level={title ? 2 : 2}
                    size='S'
                    css={{
                      marginBottom: SPACING.XS,
                      marginTop: '0 !important'
                    }}
                  >
                    {heading}
                  </Heading>
                )}

                <Html html={html} />
              </div>
            </section>
          );
        })}
      </PanelTemplate>
    );
  }

  return null;
};

TextPanel.propTypes = {
  data: PropTypes.object
};

export default function Panels ({ data }) {
  if (!data) {
    return null;
  }
  const hoursPanel = data.find((panel) => {
    // eslint-disable-next-line no-underscore-dangle
    return panel.__typename === 'paragraph__hours_panel';
  });

  return (
    <PanelStateWrapper>
      {hoursPanel && <HoursPanelDateViewer data={hoursPanel} key={hoursPanel.id} />}
      {data.map((panel) => {
        // eslint-disable-next-line no-underscore-dangle
        const type = panel.__typename;
        const { id } = panel;

        switch (type) {
          case 'paragraph__hours_panel_lite':
            return <HoursLitePanel data={panel} key={id} />;
          case 'paragraph__link_panel':
            return <LinkPanel data={panel} key={id} />;
          case 'paragraph__group_panel':
            return <GroupPanel data={panel} key={id} />;
          case 'paragraph__card_panel':
            return <CardPanel data={panel} key={id} />;
          case 'paragraph__text_panel':
            return <TextPanel data={panel} key={id} />;
          case 'paragraph__hours_panel':
            return <HoursPanel data={panel} key={id} />;
          case 'paragraph__hero_panel':
            return <HeroPanel data={panel} key={id} />;
          case 'paragraph__custom_panel':
            return <CustomPanel data={panel} key={id} />;
          default:
            return null;
        }
      })}
    </PanelStateWrapper>
  );
}

Panels.propTypes = {
  data: PropTypes.array
};

const PanelStateWrapper = ({ children }) => {
  const initialState = {
    weekOffset: 0
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case 'setWeekOffset':
        return {
          ...state,
          weekOffset: action.weekOffset
        };
      default:
        return state;
    }
  };

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      {children}
    </StateProvider>
  );
};

PanelStateWrapper.propTypes = {
  children: PropTypes.any
};

export { PanelTemplate, PanelList };
