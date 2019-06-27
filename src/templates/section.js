import React from 'react'
import { graphql } from "gatsby"

import {
  Margins,
  Heading,
  SPACING
} from '@umich-lib/core'

import Layout from "../components/layout"
import SEO from '../components/seo'
import {
  Template,
  Top,
  Side,
  Content
} from '../components/page-layout'
import HTML from '../components/html'
import Breadcrumb from '../components/breadcrumb'
import SideNavigation from '../components/side-navigation'
import Panels from '../components/panels'

function SectionTemplate({ data, ...rest }) {
  const {
    title
  } = data.page

  return (
    <Layout>
      <SEO title={title} />
      {title}
    </Layout>
  )
}

export default SectionTemplate

export const query = graphql`
  query($slug: String!) {
    page: nodeSectionPage(fields: { slug: { eq: $slug } }) {
      title
    }
  }
`