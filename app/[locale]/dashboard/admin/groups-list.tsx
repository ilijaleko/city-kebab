"use client";

import { Button } from "@/components/ui/button";
import { deleteGroup } from "@/lib/actions/groups";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

type Group = {
  id: string;
  code: string;
  createdAt: Date;
  orderCount: number;
  total: number;
};

export function GroupsList({ groups }: { groups: Group[] }) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-5">
      {groups.length === 0 ? (
        <p className="text-sm text-stone-500 dark:text-stone-400 text-center py-4">
          Nema grupa
        </p>
      ) : (
        <div className="space-y-2">
          {groups.map((group) => (
            <GroupRow key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupRow({ group }: { group: Group }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Obrisati grupu ${group.code}?`)) return;

    startTransition(async () => {
      try {
        await deleteGroup(group.id);
        toast.success(`Grupa ${group.code} obrisana`);
      } catch {
        toast.error("Brisanje nije uspjelo");
      }
    });
  }

  return (
    <div className="flex items-center gap-3 py-2 border-b border-stone-100 dark:border-stone-800 last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-playfair font-bold text-sm tracking-widest text-orange-600 dark:text-orange-400">
            {group.code}
          </span>
          <span className="text-[10px] text-stone-400 dark:text-stone-500">
            {group.orderCount} narudžbi
          </span>
          {group.total > 0 && (
            <span className="text-[10px] text-stone-400 dark:text-stone-500">
              &middot; {group.total.toFixed(2)} &euro;
            </span>
          )}
        </div>
        <p className="text-[10px] text-stone-400 dark:text-stone-500">
          {group.createdAt.toLocaleDateString("hr-HR", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        className="cursor-pointer text-stone-400 hover:text-red-600 dark:hover:text-red-400 h-8 w-8 p-0 flex-shrink-0"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

