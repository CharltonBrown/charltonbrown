import { useState, useEffect, useRef } from 'react';

export default function useIsOverlapping({
  rootRef,
  targetClass,
  inside,
  scrollElement,
}) {
  const [isOverlapping, setIsOverlapping] = useState(false);
  const root = useRef(rootRef);

  function handleOverlap() {
    const rootElement = root.current;
    const components = document.querySelectorAll(`.${targetClass}`);

    if (!rootElement.current && !components.length) return null;

    const rootTop = rootElement.current.getBoundingClientRect().top;
    const rootRight = rootElement.current.getBoundingClientRect().right;
    const rootBottom = rootElement.current.getBoundingClientRect().bottom;
    const rootLeft = rootElement.current.getBoundingClientRect().left;

    const overlappingItems = Array.prototype.slice
      .call(components)
      .filter((component) => {
        const componentTop = component.getBoundingClientRect().top;
        const componentRight = component.getBoundingClientRect().right;
        const componentBottom = component.getBoundingClientRect().bottom;
        const componentLeft = component.getBoundingClientRect().left;

        // Explain: if one or more expressions in the parenthese are true,
        // there's no overlapping. If all are false, there must be an overlapping.
        const checkIsOverlapping = !(
          rootRight < componentLeft ||
          rootLeft > componentRight ||
          rootBottom < componentTop ||
          rootTop > componentBottom
        );

        const checkIsInside =
          componentTop <= rootTop &&
          rootTop <= componentTop &&
          componentTop <= rootBottom &&
          rootBottom <= componentTop &&
          componentLeft <= rootLeft &&
          rootLeft <= componentRight &&
          componentLeft <= rootRight &&
          rootRight <= componentRight;

        if (inside && checkIsInside) {
          return component;
        }

        if (checkIsOverlapping) {
          return component;
        }

        return null;
      });

    return setIsOverlapping(!!overlappingItems.length);
  }

  useEffect(() => {
    handleOverlap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  useEffect(() => {
    const scrollTarget = document.querySelector(scrollElement) || window;

    function watchScroll() {
      scrollTarget.addEventListener('scroll', handleOverlap);
      scrollTarget.addEventListener('scrollEnd', handleOverlap);
    }
    watchScroll();

    return () => {
      scrollTarget.removeEventListener('scroll', handleOverlap);
      scrollTarget.removeEventListener('scrollEnd', handleOverlap);
    };
  });

  return { isOverlapping };
}
