"use client";

import { useState, useEffect } from "react";

export type ShopStatus = "open" | "closing" | "closed";

export function useShopStatus(): ShopStatus {
  const [status, setStatus] = useState<ShopStatus>("closed");

  useEffect(() => {
    function check() {
      const now = new Date();
      const day = now.getDay();
      const time = now.getHours() + now.getMinutes() / 60;

      if (day >= 1 && day <= 5) {
        if (time >= 9 && time < 20.5) setStatus("open");
        else if (time >= 20.5 && time < 21) setStatus("closing");
        else setStatus("closed");
      } else {
        setStatus("closed");
      }
    }
    check();
    const interval = setInterval(check, 60_000);
    return () => clearInterval(interval);
  }, []);

  return status;
}

export const STATUS_DOT: Record<ShopStatus, string> = {
  open: "bg-green-500",
  closing: "bg-yellow-500",
  closed: "bg-red-400/70 dark:bg-red-500/60",
};
