import React from 'react'
import { Link } from 'gatsby'
import {
  COLORS
} from '@umich-lib/core'
import styled from 'react-emotion'

const Breadcrumb = styled('ol')({
  listStyle: 'none',
  padding: '0',
  marginTop: '0.5rem',
  borderBottom: `solid 3px ${COLORS.neutral[100]}`
})

const BreadCrumbItem = styled('li')({
  display: 'inline-block',
  fontSize: '0.875rem',
  color: COLORS.neutral[400],
  paddingRight: '0.5rem',
  "&:not(:first-child):before": {
    content: '"/"',
    marginRight: '0.5rem'
  }
})

const BreadCrumbItemLink = styled(Link)({
  display: 'inline-block',
  textDecoration: 'none',
  fontSize: '0.875rem',
  padding: '0.25rem 0',
  ':hover': {
    textDecoration: 'underline'
  }
})

const Breadcrumbs = ({ data }) => {
  return (
    <nav aria-label="site breadcrumb">
      <Breadcrumb>
        {data && (
          <React.Fragment>
            {data.map(item => (
              <BreadCrumbItem>
                <BreadCrumbItemLink to={item.to}>{item.text}</BreadCrumbItemLink>
              </BreadCrumbItem>
            ))}
          </React.Fragment>
        )}
      </Breadcrumb>
    </nav>
  )
}

export default Breadcrumbs