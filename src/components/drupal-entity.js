import { graphql, useStaticQuery } from 'gatsby';
import Image from './image';
import Link from './link';
import MediaPlayer from './media-player';
import PropTypes from 'prop-types';
import React from 'react';

export default function DrupalEntity (props) {
  console.log('DrupalEntity props:', props);
  const data = useStaticQuery(
    graphql`
      {
        allMediaRemoteVideo {
          edges {
            node {
              drupal_id
              field_media_oembed_video
            }
          }
        }
        allMediaFile {
          edges {
            node {
              drupal_id
              name
              relationships {
                field_media_file {
                  filemime
                  localFile {
                    publicURL
                  }
                }
              }
            }
          }
        }
        allMediaImage(
          filter: {
            relationships: {
              field_media_image: { localFile: { extension: { eq: "jpg" } } }
            }
          }
        ) {
          edges {
            node {
              drupal_id
              field_media_image {
                alt
              }
              relationships {
                field_media_image {
                  localFile {
                    childImageSharp {
                      gatsbyImageData(
                        width: 920
                        placeholder: NONE
                        layout: CONSTRAINED
                      )
                    }
                  }
                }
              }
            }
          }
        }
      }
    `
  );

  const videoNode = data.allMediaRemoteVideo.edges.find(
    (edge) => {
      return edge.node.drupal_id === props['data-entity-uuid'];
    }
  );
  const videoUrl = videoNode?.node?.field_media_oembed_video;
  if (videoUrl) {
    return <MediaPlayer url={videoUrl} />;
  }

  const mediaImageNode = data.allMediaImage.edges.find(
    (edge) => {
      return edge.node.drupal_id === props['data-entity-uuid'];
    }
  );
  const alt = mediaImageNode?.node?.field_media_image?.alt;
  const mediaImage
    = mediaImageNode?.node?.relationships?.field_media_image?.localFile
      ?.childImageSharp?.gatsbyImageData;
  if (mediaImage) {
    return (
      <div css={{ maxWidth: '38rem' }}>
        <Image image={mediaImage} alt={alt} />
      </div>
    );
  }

  const fileNode = data.allMediaFile.edges.find(
    (edge) => {
      return edge.node.drupal_id === props['data-entity-uuid'];
    }
  );
  if (fileNode) {
    const file = fileNode?.node?.relationships?.field_media_file;
    const to = file.localFile?.publicURL;
    const fileType = file?.filemime === 'application/pdf' ? ' (PDF)' : '';
    const label = fileNode?.node?.name + fileType;

    if (!to || !label) {
      return null;
    }

    return <Link to={to}>{label}</Link>;
  }

  return null;
}

DrupalEntity.propTypes = {
  'data-entity-uuid': PropTypes.string
};
