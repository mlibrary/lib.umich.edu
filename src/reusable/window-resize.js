import React from 'react';

// Force resizing less often
function debounce(fn, ms) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
    }, ms);
  };
}

export default function WindowResize() {
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth
  });
  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        width: window.innerWidth
      })
    }, 500);
    window.addEventListener('resize', debouncedHandleResize);
    // Clean up listener
    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
    }
  });
  return dimensions.width;
}
