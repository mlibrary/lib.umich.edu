import styled from '@emotion/styled'
import {
  SPACING
} from '@umich-lib/core'

const Prose = styled("div")({
  "> *:not(:last-child)": {
    marginBottom: SPACING["M"]
  },
  "> h2:not(:last-child)": {
    marginTop: SPACING["2XL"]
  },
  "> h3:not(:last-child)": {
    marginTop: SPACING["M"]
  },
  "> h4:not(:last-child)": {
    marginTop: SPACING["M"]
  },
  "> h5:not(:last-child)": {
    marginTop: SPACING["M"]
  },
  li: {
    marginBottom: SPACING["XS"]
  },
  '[data-umich-lib-callout]': {
    margin: `${SPACING['3XL']} 0`,
  },
  '[data-umich-lib-callout] + [data-umich-lib-callout]': {
    marginTop: SPACING['L']
  },
  '[data-umich-lib-callout] + h2, [data-umich-lib-callout] + h3, [data-umich-lib-callout] + h4': {
    marginTop: SPACING['4XL']
  }
});

export default Prose