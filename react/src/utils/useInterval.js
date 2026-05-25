import { useEffect, useEffectEvent } from 'react';

export default function useInterval(cb, delay = 1000) {
  const fun = useEffectEvent(cb);

  useEffect(() => {
    const timer = setInterval(fun, delay);
    return () => clearInterval(timer);
  }, [delay]);
}
