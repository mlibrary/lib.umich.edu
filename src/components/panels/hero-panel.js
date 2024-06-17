import HeroSearchBox from '../panels/hero-search-box';
import HeroText from '../panels/hero-text';
import PropTypes from 'prop-types';
import React from 'react';

/*
 *We have two types of heros.
 *
 *1. One that puts provides access to Library Search, "lib_search_box"
 *2. A heading and HTML content on an image, "text"
 */
export default function HeroPanel ({ data }) {
  const { field_machine_name: fieldMachineName } = data.relationships.field_hero_template;

  if (fieldMachineName === 'lib_search_box') {
    return <HeroSearchBox data={data} />;
  }

  if (fieldMachineName === 'text') {
    return <HeroText data={data} />;
  }

  return null;
}

HeroPanel.propTypes = {
  data: PropTypes.object
};
