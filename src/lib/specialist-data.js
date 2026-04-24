/**
 * Specialist Data Fetching
 *
 * Fetches specialist taxonomy terms from Drupal JSON:API for the
 * Find a Specialist page.
 */
import { DRUPAL_URL, fetchWithRetry, removeTrailingSlash } from './drupal.js';
import { getAllUsersBasic } from './user-data.js';

/**
 * Fetch specialist taxonomy terms from Drupal JSON:API
 *
 * Fetches all 4 taxonomy vocabularies used by the specialist page:
 *   - taxonomy_term/health_sciences
 *   - taxonomy_term/academic_discipline
 *   - taxonomy_term/collecting_areas
 *   - taxonomy_term/library_expertise
 *
 * Each includes field_synonym and user__user relationships, plus
 * field_health_sciences_category for health_sciences terms.
 *
 * Returns { healthSciences, academicDiscipline, collectingAreas, libraryExpertise }
 * where each value is an array of taxonomy term objects from JSON:API.
 */
export const fetchSpecialistTaxonomies = async () => {
  const baseUrl = removeTrailingSlash(DRUPAL_URL);

  const fetchTaxonomy = async (vocabulary, extraIncludes = []) => {
    // NOTE: user__user is NOT included here. In Drupal's JSON:API, you cannot include
    // reverse relationships (users → taxonomy terms). gatsby-source-drupal synthesized
    // that back-reference automatically. We rebuild it below by scanning user relationships.
    const includes = ['field_synonym', ...extraIncludes].join(',');
    const url = `${baseUrl}/jsonapi/taxonomy_term/${vocabulary}?include=${includes}`;

    let allData = [];
    let allIncluded = [];
    let nextUrl = url;

    while (nextUrl) {
      const response = await fetchWithRetry(nextUrl);
      allData = allData.concat(response.data || []);
      if (response.included) {
        allIncluded = allIncluded.concat(response.included);
      }
      nextUrl = response.links?.next?.href || null;
    }

    return { data: allData, included: allIncluded };
  };

  // Fetch taxonomy terms and all users in parallel.
  // Users are fetched without a fields restriction so their relationship objects
  // are present — we need them to build the reverse term→user index.
  const [
    [healthSciences, academicDiscipline, collectingAreas, libraryExpertise],
    users
  ] = await Promise.all([
    Promise.all([
      fetchTaxonomy('health_sciences', ['field_health_sciences_category']),
      fetchTaxonomy('academic_discipline'),
      fetchTaxonomy('collecting_areas'),
      fetchTaxonomy('library_expertise'),
    ]),
    getAllUsersBasic()
  ]);

  return { healthSciences, academicDiscipline, collectingAreas, libraryExpertise, users };
};
