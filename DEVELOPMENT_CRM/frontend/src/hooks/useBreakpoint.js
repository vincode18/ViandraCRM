import { useState, useEffect } from 'react';

export function getBreakpoint() {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState(() => getBreakpoint());

  useEffect(() => {
    const handleResize = () => setBreakpoint(getBreakpoint());
    
    const mq = window.matchMedia('(min-width: 768px)');
    mq.addEventListener('change', handleResize);
    
    return () => {
      mq.removeEventListener('change', handleResize);
    };
  }, []);

  return breakpoint;
}

export function useIsMobile() {
  return useBreakpoint() === 'mobile';
}

export function useIsTablet() {
  return useBreakpoint() === 'tablet';
}

export function useIsDesktop() {
  return useBreakpoint() === 'desktop';
}
