import { useRef, useState, useEffect, LegacyRef } from "react";
//LegacyRef<HTMLElement>>
export default function useScrollPercentage() {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const scrolled = Math.round((winScroll / height) * 100)

      setScrollPercentage(scrolled);
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll)
  }, []);

  // return [scrollRef, Number.isNaN(scrollPercentage) ? 0 : scrollPercentage];
  return { scrollPercentage };
}
