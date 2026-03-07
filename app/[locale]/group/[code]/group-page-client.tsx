"use client";

import { GitHubStar } from "@/components/github-star";
import { Header } from "@/components/header";
import { OrderForm } from "@/components/order-form";
import { OrderList } from "@/components/order-list";
import { SmsModal } from "@/components/sms-modal";
import { Button } from "@/components/ui/button";
import { MENU_CATEGORIES } from "@/lib/menu";
import type { PriceMap } from "@/lib/prices";
import { STATUS_DOT, useShopStatus } from "@/lib/shop-status";
import {
  ChevronRight,
  Copy,
  MapPin,
  Clock,
  MessageSquare,
  Quote,
} from "lucide-react";
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
  const tHome = useTranslations("home");
  const tKebab = useTranslations("kebab");
  const tCommon = useTranslations("common");
  const [smsOpen, setSmsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const status = useShopStatus();
  const hasPrices = Object.keys(prices).length > 0;

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

        {/* Shop info strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-stone-400 dark:text-stone-500 mb-3 sm:mb-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              {status !== "closed" && (
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${STATUS_DOT[status]}`}
                />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${STATUS_DOT[status]}`}
              />
            </span>
            <span
              className={`text-[10px] sm:text-xs ${status === "open" ? "text-green-700 dark:text-green-400" : status === "closing" ? "text-yellow-700 dark:text-yellow-400" : "text-stone-500 dark:text-stone-500"}`}
            >
              {status === "open"
                ? tHome("openNow")
                : status === "closing"
                  ? tHome("closingSoon")
                  : tHome("closedNow")}
            </span>
          </span>
          <span className="text-[10px] sm:text-xs">&#183;</span>
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span className="text-[10px] sm:text-xs">{tHome("location")}</span>
          </span>
          <span className="text-[10px] sm:text-xs">&#183;</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span className="text-[10px] sm:text-xs">{tHome("hours")}</span>
          </span>
        </div>

        {/* About City Kebab expandable */}
        <div className="mb-5 sm:mb-6">
          <button
            onClick={() => setAboutOpen(!aboutOpen)}
            className="flex items-center gap-1.5 mx-auto text-[10px] sm:text-xs uppercase tracking-wider text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
          >
            <ChevronRight
              className={`h-3 w-3 transition-transform duration-200 ${aboutOpen ? "rotate-90" : ""}`}
            />
            {t("aboutShop")}
          </button>

          {aboutOpen && (
            <div className="mt-3 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5 animate-fade-in">
              {/* Menu / Prices */}
              {hasPrices && (
                <div className="space-y-4 sm:space-y-5">
                  {MENU_CATEGORIES.map((category) => {
                    const visibleItems = category.items.filter(
                      (item) => prices[item.priceKey] != null,
                    );
                    if (visibleItems.length === 0) return null;
                    return (
                      <div key={category.labelKey}>
                        <h3 className="font-playfair text-sm font-bold text-stone-900 dark:text-stone-50 mb-2">
                          {tKebab(category.labelKey)}
                        </h3>
                        <div className="space-y-1.5">
                          {visibleItems.map((item) => (
                            <div
                              key={item.priceKey}
                              className="flex items-baseline gap-2"
                            >
                              <span className="text-sm text-stone-700 dark:text-stone-300">
                                {item.sizeKey
                                  ? tKebab(item.sizeKey)
                                  : tKebab(item.labelKey)}
                              </span>
                              <span className="flex-1 border-b border-dotted border-stone-300 dark:border-stone-700 translate-y-[-3px]" />
                              <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                                {prices[item.priceKey]!.toFixed(2)} &euro;
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-[10px] sm:text-xs text-stone-400 dark:text-stone-500 text-center italic">
                    {t("menuNote")}
                  </p>
                </div>
              )}

              {/* Reviews */}
              <div
                className={
                  hasPrices
                    ? "mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-stone-200 dark:border-stone-800"
                    : ""
                }
              >
                <div className="space-y-3">
                  {([1, 2] as const).map((num) => (
                    <div key={num}>
                      <Quote className="h-3.5 w-3.5 text-stone-200 dark:text-stone-700 mb-1" />
                      <p className="font-playfair italic text-stone-800 dark:text-stone-300 text-sm leading-relaxed">
                        {tHome(`review${num}Text`)}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-stone-800 dark:to-stone-700 flex items-center justify-center flex-shrink-0">
                          <span className="font-playfair text-[10px] font-bold text-white dark:text-stone-200">
                            {tHome(`review${num}Author`).charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-stone-900 dark:text-stone-50">
                            {tHome(`review${num}Author`)}
                          </p>
                          <p className="text-[10px] text-stone-500 dark:text-stone-400">
                            {tHome(`review${num}Role`)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
