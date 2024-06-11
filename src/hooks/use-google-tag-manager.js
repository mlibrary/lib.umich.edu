import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

/*
 *Adds Google Tag Manager event values.
 *- Values are debounced at 500ms
 */
export default function useGoogleTagManager ({ eventName, value }) {
  const [initialized, setInitialized] = useState(false);
  const [valueDebounced] = useDebounce(value, 500);

  useEffect(() => {
    if (initialized && valueDebounced.length > 0) {
      if (!window.dataLayer) {
        window.dataLayer = [];
      }
      window.dataLayer.push({
        event: eventName,
        value: valueDebounced
      });
    } else {
      setInitialized(true);
    }
  }, [initialized, valueDebounced, eventName]);

  return null;
}
