"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Header } from "@/components/header";
import { OrderForm } from "@/components/order-form";
import { OrderList } from "@/components/order-list";
import { SmsModal } from "@/components/sms-modal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
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
  orders: Order[];
  locale: string;
};

export function GroupPageClient({
  groupCode,
  orders,
  locale,
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-md px-4 py-6">
        <Header showBack backHref={`/${locale}`} />

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-orange-600">
                  {t("title")}
                </CardTitle>
                <CardDescription>{t("subtitle")}</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyLink}
                className="cursor-pointer"
              >
                <Copy className="h-4 w-4 mr-1" />
                {t("copyLink")}
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {t("groupCode")}:{" "}
              <span className="font-mono font-bold tracking-widest">
                {groupCode}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{t("shareLink")}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Order Form */}
            <OrderForm groupCode={groupCode} />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {t("orders")} ({orders.length})
                </span>
              </div>
            </div>

            {/* Order List */}
            <OrderList orders={orders} />

            {/* SMS Button */}
            {orders.length > 0 && (
              <Button
                onClick={() => setSmsOpen(true)}
                variant="outline"
                className="w-full cursor-pointer"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {t("generateSms")}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-4 text-center text-xs text-muted-foreground pb-4">
          <span className="font-mono tracking-widest">{groupCode}</span>
        </footer>
      </div>

      {/* SMS Modal */}
      <SmsModal
        orders={orders}
        open={smsOpen}
        onClose={() => setSmsOpen(false)}
      />

      <Toaster />
    </div>
  );
}
