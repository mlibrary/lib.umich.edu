import PropTypes from 'prop-types';
import React from 'react';
import ReactPlayer from 'react-player';

export default function MediaPlayer ({ url }) {
  if (!url) {
    return null;
  }

  return (
    <div
      css={{
        paddingTop: '56.25%',
        position: 'relative'
      }}
    >
      <ReactPlayer
        url={url}
        width='100%'
        height='100%'
        controls={true}
        css={{
          left: '0',
          position: 'absolute',
          top: '0'
        }}
      />
    </div>
  );
}

MediaPlayer.propTypes = {
  url: PropTypes.string
};
