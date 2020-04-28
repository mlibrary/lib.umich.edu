import React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import MediaPlayer from './media-player'
import Image from './image'

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
        allMediaImage {
          edges {
            node {
              drupal_id
              relationships {
                field_media_image {
                  localFile {
                    childImageSharp {
                      fluid(maxWidth: 920) {
                        ...GatsbyImageSharpFluid_noBase64
                      }
                    }
                  }
                }
              }
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

  const mediaImageNode = data.allMediaImage.edges.find(
    edge => edge.node.drupal_id === props['data-entity-uuid']
  )
  const mediaImage =
    mediaImageNode?.node?.relationships?.field_media_image?.localFile
      ?.childImageSharp?.fluid
  if (mediaImage) {
    return <Image image={mediaImage} />
  }

  return null
}
