/**
 * Shared build-time memoization helpers.
 *
 * Astro re-executes page/component frontmatter for every route, so any
 * Drupal fetch called directly from a component (e.g. nav data used by the
 * Header on every page) runs once per PAGE instead of once per BUILD unless
 * the result is memoized. This module centralizes that memoization pattern
 * so callers don't each hand-roll their own `let cache = null` bookkeeping.
 */

/**
 * Memoizes a zero-argument async factory so it only runs once per build.
 * Concurrent callers made before the factory resolves all share the same
 * in-flight promise (no duplicate requests). If the factory rejects, the
 * cache is cleared so the next call can retry.
 *
 * @template T
 * @param {() => Promise<T>} factory
 * @returns {() => Promise<T>}
 */
export function onceAsync(factory) {
  let promise = null;
  return () => {
    if (!promise) {
      promise = factory().catch((err) => {
        promise = null;
        throw err;
      });
    }
    return promise;
  };
}

/**
 * Memoizes an async factory keyed by its argument (e.g. fetch-by-id), so
 * each key is only fetched once per build. Concurrent callers for the same
 * key share the same in-flight promise. Failed lookups are evicted so a
 * later call can retry.
 *
 * @template K, V
 * @param {(key: K) => Promise<V>} factory
 * @returns {(key: K) => Promise<V>}
 */
export function onceAsyncByKey(factory) {
  const cache = new Map();
  return (key) => {
    if (!cache.has(key)) {
      const promise = factory(key).catch((err) => {
        cache.delete(key);
        throw err;
      });
      cache.set(key, promise);
    }
    return cache.get(key);
  };
}
