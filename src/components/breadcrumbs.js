import React from 'react'
import { Link } from 'gatsby'
import {
  colors
} from '@umich-lib-ui/styles'
import styled from 'react-emotion'

const StyledBread = styled('ol')({
  listStyle: 'none',
  padding: '0',
  marginTop: '0.5rem',
  borderBottom: `solid 3px ${colors.grey[300]}`
})

const StyledCrumb = styled('li')({
  display: 'inline-block',
  fontSize: '0.875rem'
})

const StyledCrumbLink = styled(Link)({
  display: 'inline-block',
  textDecoration: 'none',
  fontSize: '0.875rem',
  padding: '0.25rem 0',
  marginRight: '0.25rem',
  ':hover': {
    textDecoration: 'underline'
  }
})

const Breadcrumbs = ({ data }) => {
  return (
    <nav aria-label="site breadcrumb">
      <StyledBread>
        <StyledCrumb>
          <StyledCrumbLink to="/">Home</StyledCrumbLink>
        </StyledCrumb>
        <StyledCrumb>
          (Breacrumb not working yet)
        </StyledCrumb>
        {data && (
          <React.Fragment>
            {data.map(item => (
              <StyledCrumb>
                <StyledCrumbLink to={item.to}>{item.text}</StyledCrumbLink>
              </StyledCrumb>
            ))}
          </React.Fragment>
        )}
      </StyledBread>
    </nav>
  )
}

export default Breadcrumbs