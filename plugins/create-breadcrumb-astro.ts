/**
 * Breadcrumb utility for Astro
 * Recreates the functionality from Gatsby's create-breadcrumb.js plugin
 */
export interface BreadcrumbItem {
  text: string;
  to?: string;
}

/**
 * Generate breadcrumb JSON string for Astro components
 * Matches the Gatsby breadcrumb data structure
 */
export function generateBreadcrumb(
  currentPage: { title: string; slug: string },
  parentPages?: Array<{ title: string; slug: string }>
): string {
  const breadcrumbs: BreadcrumbItem[] = [
    { text: 'Home', to: '/' }
  ];
  
  // Add parent pages if available
  if (parentPages?.length) {
    breadcrumbs.push(
      ...parentPages.map(page => ({
        text: page.title,
        to: page.slug
      }))
    );
  }
  
  // Add current page (no 'to' since it's current)
  breadcrumbs.push({ text: currentPage.title });
  
  return JSON.stringify(breadcrumbs);
}

/**
 * Create default breadcrumb (matches Gatsby fallback)
 * Used when no breadcrumb field is available
 */
export function createDefaultBreadcrumb(title: string): string {
  const defaultBreadcrumb: BreadcrumbItem[] = [
    { text: 'Home', to: '/' }, 
    { text: title }
  ];
  
  return JSON.stringify(defaultBreadcrumb);
}

/**
 * Process Drupal breadcrumb data (for future CMS integration)
 * Matches the processBreadcrumbData function from Gatsby plugin
 */
export function processBreadcrumbData(data: any[]): string | null {
  if (!data || data.length === 0) {
    return null;
  }
  
  let result: BreadcrumbItem[] = [];
  
  const getParentItem = (item: any) => {
    result = result.concat({
      text: item.text,
      to: item.to
    });
    if (item.parent) {
      getParentItem(item.parent[0]);
    }
  };
  
  getParentItem(data[0]);
  
  // Reverse order (Gatsby does this to get correct hierarchy)
  result = result.reverse();
  
  return JSON.stringify(result);
}