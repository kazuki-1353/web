import { useEffect } from 'react';

export default function useFetch(url, requestInit) {
  const [data, setData] = useState(null);

  useEffect(() => {
    let ignore = false;

    fetch(url, requestInit)
      .then(res => res.json())
      .then(json => {
        if (!ignore) setData(json); // 避免竞态条件
      });

    return () => {
      ignore = true;
    };
  }, [url]);

  return data;
};
