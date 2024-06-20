export default function createSlug (string) {
  return string
    .toLowerCase()
    .replace(/[^a-z0-9]/gu, '-')
    .replace(/-+/gu, '-');
}
