import { useState, useEffect } from 'react';

/** 判断元素可见性 **/
export default function useIsIntersecting(ref, threshold = 1) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const dom = ref.current;
    const observer = new IntersectionObserver(entries => {
      const _isIntersecting = entries.find(entries => entries.isIntersecting);
      setIsIntersecting(_isIntersecting);
    }, { threshold });

    observer.observe(dom);
    return () => {
      observer.unobserve(dom);
    }
  }, [ref, threshold]);

  return isIntersecting;
}
