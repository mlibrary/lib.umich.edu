import React from "react";
import {
  Heading,
  SPACING,
  COLORS,
  Margins,
  MEDIA_QUERIES
} from "@umich-lib/core";

import Breadcrumb from './breadcrumb'

export default function PageHeaderMini({
  breadcrumb,
  title,
  ...rest
}) {
  return (
    <header
      css={{
        background: COLORS.blue['100'],
      }}
      {...rest}
    >
      <Margins>
        <div
          css={{
            [MEDIA_QUERIES.LARGESCREEN]: {
              flex: "1 1 0",
            },
            paddingTop: '0',
            paddingRight: SPACING['2XL'],
            paddingLeft: "0"
          }}
        >
          <Breadcrumb
            data={breadcrumb}
            css={{
              [MEDIA_QUERIES.LARGESCREEN]: {
                paddingTop: SPACING['L'],
                paddingBottom: SPACING['L']
              }
            }}
          />
          <Heading
            size="3XL"
            level={1}
            css={{
              [MEDIA_QUERIES.LARGESCREEN]: {
                marginTop: SPACING["S"]
              }
            }}
          >
            {title}
          </Heading>
        </div>
      </Margins>
    </header>
  );
}