"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <Card className="w-full max-w-md mx-4 shadow-lg max-h-[80vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("smsTitle")}</CardTitle>
              <CardDescription>{t("smsSubtitle")}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="cursor-pointer"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto space-y-4">
          <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md font-mono">
            {smsText}
          </pre>
          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
            >
              <Copy className="h-4 w-4 mr-2" />
              {t("copySms")}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              {tCommon("close")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
