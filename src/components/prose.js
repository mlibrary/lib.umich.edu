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
    marginTop: SPACING["2XL"]
  },
  "> h4:not(:last-child)": {
    marginTop: SPACING["XL"],
    marginBottom: SPACING["XS"]
  },
  "> h5:not(:last-child)": {
    marginTop: SPACING["XL"],
    marginBottom: SPACING["XS"]
  },
  li: {
    marginBottom: SPACING["XS"]
  },
  'img': {
    marginTop: SPACING["XL"],
    marginBottom: SPACING["XL"]
  }
});

export default Prose