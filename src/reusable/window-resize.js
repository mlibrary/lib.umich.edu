import React from 'react';

function canUseDOM() {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );  
}

const useIsomorphicLayoutEffect = canUseDOM()
  ? React.useLayoutEffect
  : React.useEffect;

export default function WindowResize() {
  let { current: hasWindow } = React.useRef(canUseDOM());
  const [dimensions, setDimensions] = React.useState({
    width: hasWindow ? window.innerWidth : 0,
    height: hasWindow ? window.innerHeight : 0,
  });
  useIsomorphicLayoutEffect(() => {
    const resize = () =>
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);
  return dimensions.width;
}
