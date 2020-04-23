import React from 'react'
import ReactPlayer from 'react-player'

export default function MediaPlayer({ url }) {
  if (!url) {
    return null
  }

  return (
    <div
      css={{
        position: 'relative',
        paddingTop: '56.25%',
      }}
    >
      <ReactPlayer
        url={url}
        light={true}
        width="100%"
        height="100%"
        controls={true}
        css={{
          position: 'absolute',
          top: '0',
          left: '0',
        }}
      />
    </div>
  )
}
