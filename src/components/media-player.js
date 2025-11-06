import PropTypes from 'prop-types';
import React from 'react';

const getYouTubeVideoId = (url) => {
  if (!url) {
    return null;
  }

  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)(?<videoId>[^"&?/\s]{11})/u;
  const match = url.match(regex);
  return match ? match.groups.videoId : null;
};

export default function MediaPlayer ({ url }) {
  if (!url) {
    return null;
  }

  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    return (
      <div css={{ backgroundColor: '#f5f5f5', padding: '20px', textAlign: 'center' }}>
        <p>Unable to load video. Please check the URL format.</p>
      </div>
    );
  }

  const getOrigin = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return 'https://lib.umich.edu';
  };

  const embedUrl = `https://www.youtube.com/embed/${videoId}?`
    + `origin=${encodeURIComponent(getOrigin())}&`
    + `enablejsapi=1&`
    + `modestbranding=1&`
    + `rel=0`;

  return (
    <div
      css={{
        paddingTop: '56.25%',
        position: 'relative'
      }}
    >
      <iframe
        src={embedUrl}
        title='YouTube video player'
        width='100%'
        height='100%'
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
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
