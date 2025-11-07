import PropTypes from 'prop-types';
import React from 'react';

const getYouTubeVideoId = (url) => {
  if (!url) {
    return null;
  }
  // Regular expression to extract YouTube video ID from various URL formats. Drupal should always provide URL with v=?, but this is more robust.
  // EG: v=q7i3zy5scvU
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)(?<videoId>[^"&?/\s]{11})/u;
  const match = url.match(regex);
  return match ? match.groups.videoId : null;
};

const getEmbedUrl = (videoId) => {
  const baseParams = new URLSearchParams({
    rel: '0' // Prevent showing related videos at the end
  });

  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    baseParams.set('origin', window.location.origin);
  }

  // Nocookie domain for enhanced privacy (hosted by Google)
  return `https://www.youtube-nocookie.com/embed/${videoId}?${baseParams.toString()}`;
};

export default function MediaPlayer ({ url }) {
  if (!url) {
    return null;
  }

  const videoId = getYouTubeVideoId(url);

  if (!videoId) {
    console.warn(`MediaPlayer: Unable to extract video ID from URL: ${url}`);
  }

  const embedUrl = getEmbedUrl(videoId);

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
        allow='accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
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
