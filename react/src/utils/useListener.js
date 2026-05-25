import { useEffect, useEffectEvent } from 'react';

export default function useListener(eventType, listener, target = window) {
  const onListener = useEffectEvent(listener);

  useEffect(() => {
    target.addEventListener(eventType, onListener);
    return () => {
      target.removeEventListener(eventType, onListener);
    };
  }, [target, eventType]);
}
