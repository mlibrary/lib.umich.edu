export default function createGoogleMapsURL ({ place_id: placeId, query }) {
  const placeQuery = placeId ? `&destination_place_id=${placeId}` : '';

  return (
    `https://www.google.com/maps/dir/?api=1`
    + `&destination=${query}${
    placeQuery}`
  );
}
