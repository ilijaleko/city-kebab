"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { OrderForm } from "@/components/order-form";
import { OrderList } from "@/components/order-list";
import { SmsModal } from "@/components/sms-modal";
import { Button } from "@/components/ui/button";
import { GitHubStar } from "@/components/github-star";
import { Copy, MessageSquare } from "lucide-react";

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

type GroupPageClientProps = {
  groupCode: string;
  groupCreatorId?: string | null;
  orders: Order[];
  locale: string;
  userId?: string | null;
};

export function GroupPageClient({
  groupCode,
  groupCreatorId,
  orders,
  locale,
  userId,
}: GroupPageClientProps) {
  const t = useTranslations("group");
  const [smsOpen, setSmsOpen] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-stone-950 dark:to-stone-900">
      {/* Warm color blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-orange-300/30 dark:bg-orange-900/20 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-orange-200/25 dark:bg-orange-900/15 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full bg-amber-300/20 dark:bg-amber-800/15 blur-3xl" />
      </div>

      <div className="relative container mx-auto max-w-md px-4 py-4 sm:py-6">
        <Header showBack backHref={`/${locale}`} />

        {/* Group header */}
        <div className="text-center mb-5 sm:mb-6">
          <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-stone-900 dark:text-amber-50">
            {t("title")}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-amber-300/50 mt-1">
            {t("subtitle")}
          </p>
        </div>

        {/* Group code & share */}
        <div className="bg-white/50 dark:bg-stone-900/50 rounded-xl border border-orange-300/40 dark:border-amber-700/30 p-4 sm:p-5 backdrop-blur-sm mb-5 sm:mb-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] sm:text-xs text-stone-500 dark:text-amber-300/50 uppercase tracking-wider">
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
          <p className="text-[10px] sm:text-xs text-stone-400 dark:text-amber-400/30 mt-2">
            {t("shareLink")}
          </p>
        </div>

        {/* Order Form */}
        <div className="bg-white/60 dark:bg-stone-900/60 rounded-xl sm:rounded-2xl border border-orange-300/40 dark:border-amber-700/30 p-5 sm:p-6 backdrop-blur-sm mb-5 sm:mb-6">
          <OrderForm groupCode={groupCode} userId={userId} />
        </div>

        {/* Orders divider */}
        <div className="relative my-5 sm:my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-orange-300/30 dark:border-amber-700/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gradient-to-b from-orange-50 to-yellow-50 dark:from-stone-950 dark:to-stone-900 px-3 text-stone-500 dark:text-amber-400/40 font-medium">
              {t("orders")} ({orders.length})
            </span>
          </div>
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
        <footer className="border-t border-orange-300/30 dark:border-amber-700/20 mt-8 py-5 text-center">
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
