import styled from '@emotion/styled'
import {
  SPACING
} from '@umich-lib/core'


const Prose = styled("div")({
  "> *": {
    marginBottom: SPACING["M"]
  },
  "> h2:not(:last-child)": {
    marginTop: SPACING["2XL"]
  },
  "> h3:not(:last-child)": {
    marginTop: SPACING["XL"]
  },
  "> h4:not(:last-child)": {
    marginTop: SPACING["XL"]
  },
  "> h5:not(:last-child)": {
    marginTop: SPACING["XL"]
  },
  li: {
    marginBottom: SPACING["XS"]
  }
});

export default Prose