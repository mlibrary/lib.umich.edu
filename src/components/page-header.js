import React from "react";
import BackgroundImage from 'gatsby-background-image'
import Img from "gatsby-image"
import {
  Heading,
  SPACING,
  Text,
  Margins,
  MEDIA_QUERIES
} from "@umich-lib/core";

import Breadcrumb from './breadcrumb'

export default function PageHeader({
  breadcrumb,
  title,
  summary,
  image,
  ...rest
}) {
  const imageData = image ? image[0].localFile.childImageSharp.fluid : null

  return (
    <Margins>
      <header
        css={{
          [MEDIA_QUERIES.LARGESCREEN]: {
            display: "flex",
            alignItems: "stretch",
            minHeight: '350px'
          }
        }}
        {...rest}
      >
        <div
          css={{
            [MEDIA_QUERIES.LARGESCREEN]: {
              flex: "1 1 0",
            },
            paddingBottom: SPACING['L'],
            paddingTop: '0',
            paddingRight: SPACING['2XL'],
            paddingLeft: "0"
          }}
        >
          <Breadcrumb data={breadcrumb} />
          <Heading
            size="3XL"
            level={2}
            css={{
              [MEDIA_QUERIES.LARGESCREEN]: {
                marginTop: SPACING["M"]
              },
              marginBottom: SPACING["M"]
            }}
          >
            {title}
          </Heading>
          <Text lede>
            {summary}
          </Text>
        </div>
        {imageData && (
          <React.Fragment>
            <BackgroundImage
              tag="div"
              fluid={imageData}
              css={{
                display: 'none',
                [MEDIA_QUERIES.LARGESCREEN]: {
                  display: 'block'
                },
                flex: "1 1 0",
                backgroundSize: "cover",
                backgroundPosition: "center",
                flexBasis: `calc(50% + ${SPACING['2XL']})`,
                flexGrow: '0',
                marginRight: `-${SPACING['2XL']}`
              }}
            />
            <Img fluid={imageData} css={{
              margin: `0 -${SPACING['M']}`,
              [MEDIA_QUERIES.LARGESCREEN]: {
                display: 'none'
              }
            }}/>
          </React.Fragment>
        )}
        
      </header>
    </Margins>
  );
}