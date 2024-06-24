export default function createSlug (string) {
  if (typeof string !== 'string') {
    return '';
  }
  return string
    .toLowerCase()
    .replace(/[^a-z0-9]/gu, '-')
    .replace(/-+/gu, '-');
}
