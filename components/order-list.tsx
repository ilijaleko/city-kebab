"use client";

import { Button } from "@/components/ui/button";
import { deleteOrder } from "@/lib/actions/orders";
import { ADDONS_EMOJIS } from "@/lib/kebab-config";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";
import { toast } from "sonner";

type Order = {
  id: string;
  name: string;
  kebabType: string;
  kebabSize: string | null;
  sauce: string;
  hasCheese: boolean | null;
  adds: string[];
  userId: string | null;
  price: number | null;
};

type OrderListProps = {
  orders: Order[];
  currentUserId?: string | null;
  isGroupCreator?: boolean;
};

function OrderDeleteButton({ orderId }: { orderId: string }) {
  const [isPending, startTransition] = useTransition();
  const tGroup = useTranslations("group");

  function handleDelete() {
    startTransition(async () => {
      try {
        await deleteOrder(orderId);
        toast.success(tGroup("orderDeleted"));
      } catch {
        toast.error(tGroup("deleteError"));
      }
    });
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={isPending}
      className="h-8 w-8 flex-shrink-0 text-stone-400 dark:text-stone-600 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 cursor-pointer"
    >
      <Trash2 className={`h-4 w-4 ${isPending ? "animate-pulse" : ""}`} />
    </Button>
  );
}

export function OrderList({
  orders,
  currentUserId,
  isGroupCreator,
}: OrderListProps) {
  const t = useTranslations("kebab");
  const tGroup = useTranslations("group");

  if (orders.length === 0) {
    return (
      <div className="text-center py-8 text-stone-400 dark:text-stone-500">
        <p className="text-sm">{tGroup("noOrders")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {orders.map((order, index) => (
        <div
          key={order.id}
          className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-3.5 sm:p-4"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-stone-800 dark:to-stone-700 text-orange-700 dark:text-stone-200 flex items-center justify-center text-sm font-bold font-playfair">
              {order.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm text-stone-900 dark:text-stone-50">
                  {order.name}
                </span>
                <span className="text-[10px] text-stone-400 dark:text-stone-500">
                  #{index + 1}
                </span>
                {order.price != null && (
                  <span className="ml-auto text-xs font-medium text-orange-600 dark:text-orange-400">
                    {order.price.toFixed(2)} &euro;
                  </span>
                )}
              </div>
              <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 space-y-0.5">
                <p>
                  {t(`types.${order.kebabType}`)}
                  {order.kebabSize && ` - ${t(`sizes.${order.kebabSize}`)}`}
                  {order.hasCheese !== null &&
                    ` - ${t("cheese")}: ${order.hasCheese ? t("cheeseYes") : t("cheeseNo")}`}
                </p>
                <p>
                  {t("sauce")}: {t(`sauces.${order.sauce}`)}
                </p>
                {order.adds.length > 0 && (
                  <p>
                    {order.adds
                      .map(
                        (addon) =>
                          `${ADDONS_EMOJIS[addon] || ""} ${t(`adds.${addon}`)}`,
                      )
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
            {currentUserId &&
              (isGroupCreator || currentUserId === order.userId) && (
                <OrderDeleteButton orderId={order.id} />
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
