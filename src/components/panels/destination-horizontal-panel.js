import { getFloor, getImage, getParentTitle, getRoom } from '../../utils';
import { Heading, SPACING, TYPOGRAPHY } from '../../reusable';
import CardImage from '../../reusable/card-image';
import Html from '../html';
import Link from '../link';
import MEDIA_QUERIES from '../../reusable/media-queries';
import PropTypes from 'prop-types';
import React from 'react';
import useFloorPlan from '../../hooks/use-floor-plan';

export default function DestinationHorizontalPanel ({ data }) {
  const cards = data.relationships.field_cards.map((card) => {
    const parentTitle = getParentTitle({ node: card });
    const floor = getFloor({ node: card });
    const imageData = getImage({ node: card });
    const room = getRoom({ node: card });

    return {
      bid: card.relationships.field_room_building.id,
      content: <Html html={card.body.processed} />,
      image: imageData.localFile.childImageSharp.gatsbyImageData,
      linkDestText: `${parentTitle} ${floor}`,
      rid: card.relationships.field_floor.id,
      subtitle: `${parentTitle}, ${floor}, ${room}`,
      title: card.title
    };
  });

  return (
    <div
      css={{
        marginTop: SPACING.XL
      }}
    >
      {cards.map((card, iterator) => {
        return (
          <DestinationCard key={`destination-${iterator}`} card={card} />
        );
      })}
    </div>
  );
}

DestinationHorizontalPanel.propTypes = {
  data: PropTypes.object
};

const DestinationCard = ({ card }) => {
  const floorPlan = useFloorPlan(card.bid, card.rid);
  const floorPlanLinkText = `View the floor plan for ${card.linkDestText}`;

  return (
    <section
      css={{
        marginBottom: SPACING.XL,
        [MEDIA_QUERIES.L]: {
          display: 'grid',
          gridGap: SPACING.M,
          gridTemplateColumns: `18.75rem 1fr `
        }
      }}
    >
      <CardImage image={card.image} />
      <div>
        <Heading
          size='S'
          level={2}
          css={{
            marginBottom: SPACING['2XS']
          }}
        >
          {card.title}
          <span
            css={{
              color: 'var(--color-neutral-300)',
              display: 'block',
              marginTop: SPACING['3XS'],
              ...TYPOGRAPHY['3XS']
            }}
          >
            {card.subtitle}
          </span>
        </Heading>
        {card.content}
        <p
          css={{
            marginTop: SPACING.M
          }}
        >
          <Link to={floorPlan.fields.slug}>{floorPlanLinkText}</Link>
        </p>
      </div>
    </section>
  );
};

DestinationCard.propTypes = {
  card: PropTypes.object
};
