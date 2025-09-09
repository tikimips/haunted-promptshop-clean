import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollProps {
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll({ 
  threshold = 1.0, 
  rootMargin = '0px' 
}: UseInfiniteScrollProps = {}) {
  const [isFetching, setIsFetching] = useState(false);
  const [targetRef, setTargetRef] = useState<HTMLDivElement | null>(null);

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setIsFetching(true);
    }
  }, []);

  useEffect(() => {
    if (!targetRef) return;

    const observer = new IntersectionObserver(handleIntersect, {
      threshold,
      rootMargin
    });

    observer.observe(targetRef);

    return () => observer.disconnect();
  }, [targetRef, handleIntersect, threshold, rootMargin]);

  return { isFetching, setIsFetching, setTargetRef };
}