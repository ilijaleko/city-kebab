"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Copy, X } from "lucide-react";

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

type SmsModalProps = {
  orders: Order[];
  open: boolean;
  onClose: () => void;
};

function formatOrderForSms(order: Order, index: number): string {
  const parts: string[] = [];
  parts.push(`${index + 1}. ${order.name}`);

  let typeLine = order.kebabType;
  if (order.kebabSize) {
    typeLine += ` ${order.kebabSize}`;
  }
  parts.push(typeLine);

  parts.push(order.sauce);

  if (order.hasCheese !== null) {
    parts.push(order.hasCheese ? "sir: da" : "sir: ne");
  }

  if (order.adds.length > 0) {
    parts.push(order.adds.join(", "));
  }

  return parts.join("\n");
}

function generateSmsText(orders: Order[]): string {
  return orders.map((order, i) => formatOrderForSms(order, i)).join("\n\n");
}

export function SmsModal({ orders, open, onClose }: SmsModalProps) {
  const t = useTranslations("group");
  const tCommon = useTranslations("common");

  if (!open) return null;

  const smsText = generateSmsText(orders);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(smsText);
      toast.success(t("smsCopied"));
    } catch {
      toast.error("Failed to copy");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-2xl max-h-[80vh] flex flex-col overflow-hidden">
        <div className="flex-shrink-0 p-5 sm:p-6 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-playfair text-lg font-bold text-stone-900 dark:text-stone-50">
                {t("smsTitle")}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {t("smsSubtitle")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="cursor-pointer h-8 w-8 text-stone-400 dark:text-stone-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          <pre className="whitespace-pre-wrap text-sm bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 p-4 rounded-xl font-mono border border-stone-200 dark:border-stone-800">
            {smsText}
          </pre>
          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              className="flex-1 bg-stone-900 hover:bg-stone-800 dark:bg-stone-50 dark:hover:bg-stone-200 dark:text-stone-900 text-white cursor-pointer rounded-xl shadow-sm"
            >
              <Copy className="h-4 w-4 mr-2" />
              {t("copySms")}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer rounded-xl"
            >
              {tCommon("close")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
