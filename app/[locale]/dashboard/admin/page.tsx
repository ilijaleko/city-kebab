import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";
import { isAdmin } from "@/lib/auth";
import { getPriceMap } from "@/lib/queries/prices";
import { PriceEditor } from "./price-editor";

const PRICE_ITEMS = [
  { key: "lepinja_mali", label: "Lepinja — Mali" },
  { key: "lepinja_veliki", label: "Lepinja — Veliki" },
  { key: "tortilja", label: "Tortilja" },
  { key: "vegetarijanski", label: "Vegetarijanski" },
  { key: "tortilja_mix_salata", label: "Tortilja mix salata" },
  { key: "cheese", label: "Sir (+)" },
  { key: "extra_meso", label: "Meso kebab (100g)" },
];

export default async function AdminPage() {
  const locale = await getLocale();

  if (!(await isAdmin())) {
    redirect(`/${locale}/dashboard`);
  }

  const prices = await getPriceMap();

  const items = PRICE_ITEMS.map((item) => ({
    ...item,
    price: prices[item.key] ?? 0,
  }));

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
          Admin
        </h1>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
          Upravljanje cijenama
        </p>
      </div>

      <PriceEditor items={items} />
    </div>
  );
}
