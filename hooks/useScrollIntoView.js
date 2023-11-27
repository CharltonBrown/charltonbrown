import { useEffect, useRef, useState } from 'react';

const useScrollIntoView = () => {
  const ref = useRef();
  const [shouldScrollTo, setShouldScrollTo] = useState(false);

  useEffect(() => {
    if (ref.current && shouldScrollTo) {
      const element = ref.current;
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShouldScrollTo(false);
    }
  }, [shouldScrollTo]);

  return [ref, setShouldScrollTo];
};

export default useScrollIntoView;
