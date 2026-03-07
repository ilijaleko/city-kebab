"use client";

import { GitHubStar } from "@/components/github-star";
import { Header } from "@/components/header";
import { OrderForm } from "@/components/order-form";
import { OrderList } from "@/components/order-list";
import { SmsModal } from "@/components/sms-modal";
import { Button } from "@/components/ui/button";
import type { PriceMap } from "@/lib/prices";
import { Copy, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
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

type Recipe = {
  id: string;
  name: string;
  userName: string | null;
  kebabType: string;
  kebabSize: string | null;
  sauce: string;
  hasCheese: boolean | null;
  adds: string[];
};

type GroupPageClientProps = {
  groupCode: string;
  groupCreatorId?: string | null;
  orders: Order[];
  locale: string;
  userId?: string | null;
  recipes?: Recipe[];
  defaultName?: string;
  prices?: PriceMap;
};

export function GroupPageClient({
  groupCode,
  groupCreatorId,
  orders,
  locale,
  userId,
  recipes = [],
  defaultName = "",
  prices = {},
}: GroupPageClientProps) {
  const t = useTranslations("group");
  const tCommon = useTranslations("common");
  const [smsOpen, setSmsOpen] = useState(false);

  const groupTotal = orders.reduce((sum, o) => sum + (o.price ?? 0), 0);

  async function handleCopyLink() {
    const url = `${window.location.origin}/${locale}/group/${groupCode}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success(t("linkCopied"));
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      <div className="container mx-auto max-w-md px-4 py-4 sm:py-6">
        <Header showBack backHref={`/${locale}`} />

        {/* Group header */}
        <div className="text-center mb-5 sm:mb-6">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-50">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            {t("subtitle")}
          </p>
        </div>

        {/* Group code & share */}
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 mb-5 sm:mb-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] sm:text-xs text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                {t("groupCode")}
              </p>
              <p className="font-playfair text-2xl sm:text-3xl font-bold tracking-widest text-orange-600 dark:text-orange-400">
                {groupCode}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="cursor-pointer flex-shrink-0 text-xs"
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" />
              {t("copyLink")}
            </Button>
          </div>
          <p className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-500 mt-2">
            {t("shareLink")}
          </p>
        </div>

        {/* Order Form */}
        <div className="bg-white dark:bg-stone-900 rounded-xl sm:rounded-2xl border border-stone-200 dark:border-stone-800 p-5 sm:p-6 mb-5 sm:mb-6">
          <OrderForm
            groupCode={groupCode}
            userId={userId}
            recipes={recipes}
            defaultName={defaultName}
            prices={prices}
          />
        </div>

        {/* Orders divider */}
        <div className="flex items-center gap-3 my-5 sm:my-6">
          <span className="flex-1 border-t border-stone-200 dark:border-stone-800" />
          <span className="text-xs uppercase text-stone-500 dark:text-stone-500 font-medium">
            {t("orders")} ({orders.length})
            {groupTotal > 0 && <> &middot; {groupTotal.toFixed(2)} &euro;</>}
          </span>
          <span className="flex-1 border-t border-stone-200 dark:border-stone-800" />
        </div>

        {/* Order List */}
        <OrderList
          orders={orders}
          currentUserId={userId}
          isGroupCreator={!!userId && userId === groupCreatorId}
        />

        {/* SMS Button */}
        {orders.length > 0 && (
          <div className="mt-5 sm:mt-6">
            <Button
              onClick={() => setSmsOpen(true)}
              variant="outline"
              className="w-full cursor-pointer rounded-xl h-10 sm:h-11"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {t("generateSms")}
            </Button>
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-stone-200 dark:border-stone-800 mt-8 py-5 text-center">
          <div className="flex justify-center">
            <GitHubStar size="sm" showText />
          </div>
        </footer>
      </div>

      {/* SMS Modal */}
      <SmsModal
        orders={orders}
        open={smsOpen}
        onClose={() => setSmsOpen(false)}
      />
    </div>
  );
}
