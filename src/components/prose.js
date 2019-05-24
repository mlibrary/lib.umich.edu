import styled from '@emotion/styled'
import {
  SPACING
} from '@umich-lib/core'


const Prose = styled("div")({
  "> *:not(:last-child)": {
    marginBottom: SPACING["M"]
  },
  "> h3:not(:last-child)": {
    marginTop: SPACING["XL"]
  },
  "> h4:not(:last-child)": {
    marginTop: SPACING["XL"],
    marginBottom: SPACING["XS"]
  },
  "> h5:not(:last-child)": {
    marginTop: SPACING["L"],
    marginBottom: SPACING["XS"]
  },
  li: {
    marginBottom: SPACING["S"]
  }
});

export default Prose