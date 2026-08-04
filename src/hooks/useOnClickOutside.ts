import { useEffect, type RefObject } from "react";

export function useOnClickOutside(
  ref: RefObject<HTMLElement | null>,
  onOutsideClick: () => void,
) {
  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (ref.current && !ref.current.contains(target)) {
        onOutsideClick();
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [ref, onOutsideClick]);
}
