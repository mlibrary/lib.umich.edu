import React from 'react'
import Layout from "../components/layout"
import styled from 'react-emotion'
import PlaceholderHeroImage from '../images/design_5210.jpg'
import TextInput from '@umich-lib-ui/text-input'
import Icon from '@umich-lib-ui/icon'
import Button from '@umich-lib-ui/button'
import {
  MEDIA_QUERIES,
  colors
} from '@umich-lib-ui/styles'

const StyledHeroContainer = styled('div')({
  height: '15rem',
  [MEDIA_QUERIES.LARGESCREEN]: {
    height: '33vh'
  },
  overflow: 'hidden',
  backgroundImage: `url(${PlaceholderHeroImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
  position: 'relative'
})

const StyledHeroInnerContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
})

const StyledSearchForm = styled('form')({
  margin: '1rem 0',
  width: '100%',
  [MEDIA_QUERIES.LARGESCREEN]: {
    width: '70%'
  },
  zIndex: '1'
})

const Hero = () => (
  <StyledHeroContainer>
    <StyledHeroInnerContainer data-inner-container>
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        bottom: '0',
        left: '0',
        background: colors.blue[500],
        opacity: '0.25'
      }}>

      </div>
      <StyledSearchForm action="https://search.lib.umich.edu/everything" method="get">
        <div className="x-spacing" style={{ display: 'flex' }}>
          <TextInput
            id="search-query"
            labelText="Search terms"
            type="search"
            hideLabel
            name="query"
            placeholder="Search the catalog, articles, databases, & more"
          />
          <Button type="submit" style={{ whiteSpace: 'nowrap' }}><Icon icon="search" size={24} /> Search</Button>
        </div>
      </StyledSearchForm>
    </StyledHeroInnerContainer>
  </StyledHeroContainer>
)

const HomePage = () => {
  return (
    <Layout>
      <Hero />
    </Layout>
  )
}

export default HomePage