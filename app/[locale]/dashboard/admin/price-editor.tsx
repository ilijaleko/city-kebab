"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePrices } from "@/lib/actions/prices";
import { toast } from "sonner";

type PriceItem = {
  key: string;
  label: string;
  price: number;
};

export function PriceEditor({ items }: { items: PriceItem[] }) {
  const [prices, setPrices] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    for (const item of items) {
      map[item.key] = item.price.toFixed(2);
    }
    return map;
  });
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    const parsed = items.map((item) => ({
      itemKey: item.key,
      price: parseFloat(prices[item.key] || "0"),
    }));

    if (parsed.some((p) => isNaN(p.price) || p.price < 0)) {
      toast.error("Nevažeća cijena");
      return;
    }

    startTransition(async () => {
      try {
        await updatePrices(parsed);
        toast.success("Cijene spremljene!");
      } catch {
        toast.error("Spremanje nije uspjelo");
      }
    });
  }

  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-3">
            <label className="flex-1 text-sm text-stone-700 dark:text-stone-300">
              {item.label}
            </label>
            <div className="relative w-28">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={prices[item.key]}
                onChange={(e) =>
                  setPrices((prev) => ({ ...prev, [item.key]: e.target.value }))
                }
                className="rounded-lg pr-7 text-right"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400">
                &euro;
              </span>
            </div>
          </div>
        ))}
      </div>
      <Button
        onClick={handleSave}
        disabled={isPending}
        className="w-full mt-4 bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-900 text-white cursor-pointer rounded-xl h-10 font-bold shadow-sm"
      >
        {isPending ? "Spremanje..." : "Spremi cijene"}
      </Button>
    </div>
  );
}
