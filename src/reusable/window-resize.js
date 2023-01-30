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

const getWindow = typeof window !== 'undefined' && window;

export default function WindowResize() {
  const [dimensions, setDimensions] = React.useState({
    width: getWindow.innerWidth
  });
  React.useEffect(() => {
    const debouncedHandleResize = debounce(function handleResize() {
      setDimensions({
        width: getWindow.innerWidth
      })
    }, 500);
    getWindow.addEventListener('resize', debouncedHandleResize);
    // Clean up listener
    return () => {
      getWindow.removeEventListener('resize', debouncedHandleResize);
    }
  });
  return dimensions.width;
}
