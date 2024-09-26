export default function getImage ({ node }) {
  const { relationships } = node;

  const imageData
    = relationships.field_media_image
    && relationships.field_media_image;

  return imageData;
}
