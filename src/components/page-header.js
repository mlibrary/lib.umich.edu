import React from "react";
import BackgroundImage from 'gatsby-background-image'
import {
  Heading,
  SPACING,
  Text,
  Margins
} from "@umich-lib/core";

import Breadcrumb from './breadcrumb'

export default function PageHeader({
  breadcrumb,
  title,
  summary,
  imageData
}) {
  return (
    <Margins>
      <header
        css={{
          display: "flex",
          alignItems: "stretch",
          minHeight: '450px'
        }}
      >
        <div
          css={{
            flex: "1 1 0",
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
            css={{ marginTop: SPACING["M"], marginBottom: SPACING["M"] }}
          >
            {title}
          </Heading>
          <Text lede>
            {summary}
          </Text>
        </div>
        <BackgroundImage
          tag="div"
          fluid={imageData}
          css={{
            flex: "1 1 0",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
      </header>
    </Margins>
  );
}