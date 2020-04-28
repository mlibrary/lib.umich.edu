import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import MediaPlayer from './media-player'

export default function DrupalEntity(props) {
  const data = useStaticQuery(
    graphql`
      query {
        allMediaRemoteVideo {
          edges {
            node {
              drupal_id
              field_media_oembed_video
            }
          }
        }
      }
    `
  )

  const videoNode = data.allMediaRemoteVideo.edges.find(
    edge => edge.node.drupal_id === props['data-entity-uuid']
  )
  const videoUrl = videoNode?.node?.field_media_oembed_video

  if (videoUrl) {
    return <MediaPlayer url={videoUrl} />
  }

  return null
}
