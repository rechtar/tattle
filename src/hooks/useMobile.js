import { useState, useEffect } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const checkIsMobile = () => {
    window.innerWidth < 1024 ? setIsMobile(true) : setIsMobile(false);
  };

  return { isMobile };
};

export { useIsMobile };
