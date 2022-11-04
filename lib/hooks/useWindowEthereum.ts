import { useEffect, useState } from "react";

export function useWindowEthereum() {
  const [windowEthereum, setWindowEthereum] = useState<any>(null);
  useEffect(() => {
    if (typeof window !== "undefined" && window?.ethereum) {
      setWindowEthereum(window?.ethereum);
    }
  }, []);
  return windowEthereum;
}
