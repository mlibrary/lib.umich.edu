export default function createGoogleMapsURL({ place_id, query }) {
  const place_query = place_id ? `&destination_place_id=${place_id}` : '';

  return (
    'https://www.google.com/maps/dir/?api=1' +
    `&destination=${query}` +
    place_query
  );
}
