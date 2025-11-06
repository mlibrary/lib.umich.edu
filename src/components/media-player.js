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

  const getEmbedUrl = () => {
    const baseParams = new URLSearchParams({
      modestbranding: '1',
      rel: '0'
    });

    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      baseParams.set('origin', window.location.origin);
    }

    return `https://www.youtube-nocookie.com/embed/${videoId}?${baseParams.toString()}`;
  };

  const embedUrl = getEmbedUrl();

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
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
        referrerPolicy='strict-origin-when-cross-origin'
        sandbox='allow-scripts allow-same-origin allow-presentation'
        css={{
          border: 0,
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
