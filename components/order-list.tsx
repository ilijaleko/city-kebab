"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { ADDONS_EMOJIS } from "@/lib/kebab-config";

type Order = {
  id: string;
  name: string;
  kebabType: string;
  kebabSize: string | null;
  sauce: string;
  hasCheese: boolean | null;
  adds: string[];
  userId: string | null;
};

type OrderListProps = {
  orders: Order[];
  currentUserId?: string | null;
};

function getTypeTranslationKey(type: string): string {
  return type.replace(/ /g, "_");
}

function getSauceTranslationKey(s: string): string {
  return s
    .replace(/ /g, "_")
    .replace(/\(/g, "")
    .replace(/\)/g, "")
    .replace("malo_manje", "manje");
}

export function OrderList({ orders }: OrderListProps) {
  const t = useTranslations("kebab");
  const tGroup = useTranslations("group");

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{tGroup("noOrders")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order, index) => (
        <Card key={order.id} className="py-3">
          <CardContent className="flex items-start gap-3 px-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
              {order.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{order.name}</span>
                <span className="text-xs text-muted-foreground">
                  #{index + 1}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5 space-y-0.5">
                <p>
                  {t(`types.${getTypeTranslationKey(order.kebabType)}`)}
                  {order.kebabSize && ` - ${t(`sizes.${order.kebabSize}`)}`}
                  {order.hasCheese !== null &&
                    ` - ${t("cheese")}: ${order.hasCheese ? t("cheeseYes") : t("cheeseNo")}`}
                </p>
                <p>
                  {t("sauce")}: {t(`sauces.${getSauceTranslationKey(order.sauce)}`)}
                </p>
                {order.adds.length > 0 && (
                  <p>
                    {order.adds
                      .map(
                        (addon) =>
                          `${ADDONS_EMOJIS[addon] || ""} ${t(`adds.${addon.replace(/ /g, "_")}`)}`
                      )
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
