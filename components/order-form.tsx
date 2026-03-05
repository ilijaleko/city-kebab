"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  KEBAB_TYPES,
  KEBAB_SIZES,
  SAUCE_OPTIONS,
  KEBAB_ADDS,
  ADDONS_EMOJIS,
  shouldShowSize,
  shouldShowCheese,
} from "@/lib/kebab-config";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { BookmarkPlus } from "lucide-react";
import { addOrder } from "@/lib/actions/orders";
import { saveRecipe } from "@/lib/actions/recipes";

type OrderFormProps = {
  groupCode: string;
  userId?: string | null;
};

export function OrderForm({ groupCode, userId }: OrderFormProps) {
  const t = useTranslations("kebab");
  const tGroup = useTranslations("group");
  const tRecipe = useTranslations("recipe");
  const tCommon = useTranslations("common");
  const [isPending, startTransition] = useTransition();
  const [isSavingRecipe, startRecipeTransition] = useTransition();

  const [name, setName] = useState("");
  const [kebabType, setKebabType] = useState("");
  const [kebabSize, setKebabSize] = useState("");
  const [sauce, setSauce] = useState("");
  const [hasCheese, setHasCheese] = useState<string>("");
  const [adds, setAdds] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [recipeDialogOpen, setRecipeDialogOpen] = useState(false);
  const [recipeName, setRecipeName] = useState("");

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

  function toggleAddon(addon: string) {
    setAdds((prev) =>
      prev.includes(addon) ? prev.filter((a) => a !== addon) : [...prev, addon],
    );
  }

  function toggleAllAddons() {
    if (adds.length === KEBAB_ADDS.length) {
      setAdds([]);
    } else {
      setAdds([...KEBAB_ADDS]);
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t("validation.nameRequired");
    if (!kebabType) newErrors.kebabType = t("validation.typeRequired");
    if (shouldShowSize(kebabType) && !kebabSize)
      newErrors.kebabSize = t("validation.sizeRequired");
    if (!sauce) newErrors.sauce = t("validation.sauceRequired");
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function resetForm() {
    setName("");
    setKebabType("");
    setKebabSize("");
    setSauce("");
    setHasCheese("");
    setAdds([]);
    setErrors({});
  }

  function handleSubmit() {
    if (!validate()) return;

    startTransition(async () => {
      try {
        await addOrder({
          groupCode,
          name: name.trim(),
          kebabType,
          kebabSize: shouldShowSize(kebabType) ? kebabSize : null,
          sauce,
          hasCheese: shouldShowCheese(kebabType) ? hasCheese === "yes" : null,
          adds,
        });
        toast.success(tGroup("orderAdded"));
        resetForm();
      } catch {
        toast.error("Failed to add order");
      }
    });
  }

  function handleSaveRecipe() {
    if (!recipeName.trim()) return;

    startRecipeTransition(async () => {
      try {
        await saveRecipe({
          name: recipeName.trim(),
          userName: name.trim() || null,
          kebabType,
          kebabSize: shouldShowSize(kebabType) ? kebabSize : null,
          sauce,
          hasCheese: shouldShowCheese(kebabType) ? hasCheese === "yes" : null,
          adds,
        });
        toast.success(tRecipe("saved"));
        setRecipeDialogOpen(false);
        setRecipeName("");
      } catch {
        toast.error("Failed to save recipe");
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("name")}</label>
        <Input
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name}</p>
        )}
      </div>

      {/* Kebab Type */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("type")}</label>
        <Select
          value={kebabType}
          onValueChange={(val) => {
            setKebabType(val);
            if (!shouldShowSize(val)) setKebabSize("");
            if (!shouldShowCheese(val)) setHasCheese("");
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("typePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {KEBAB_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {t(`types.${getTypeTranslationKey(type)}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.kebabType && (
          <p className="text-xs text-destructive">{errors.kebabType}</p>
        )}
      </div>

      {/* Kebab Size (conditional) */}
      {shouldShowSize(kebabType) && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t("size")}</label>
          <Select value={kebabSize} onValueChange={setKebabSize}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("sizePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {KEBAB_SIZES.map((size) => (
                <SelectItem key={size} value={size}>
                  {t(`sizes.${size}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.kebabSize && (
            <p className="text-xs text-destructive">{errors.kebabSize}</p>
          )}
        </div>
      )}

      {/* Sauce */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">{t("sauce")}</label>
        <Select value={sauce} onValueChange={setSauce}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("saucePlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {SAUCE_OPTIONS.map((s) => (
              <SelectItem key={s} value={s}>
                {t(`sauces.${getSauceTranslationKey(s)}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.sauce && (
          <p className="text-xs text-destructive">{errors.sauce}</p>
        )}
      </div>

      {/* Cheese (conditional) */}
      {shouldShowCheese(kebabType) && (
        <div className="space-y-1.5">
          <label className="text-sm font-medium">{t("cheese")}</label>
          <Select value={hasCheese} onValueChange={setHasCheese}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t("cheese")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="yes">{t("cheeseYes")}</SelectItem>
              <SelectItem value="no">{t("cheeseNo")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Addons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">{t("addons")}</label>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={toggleAllAddons}
            className="cursor-pointer"
          >
            {t("addonsAll")}
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {KEBAB_ADDS.map((addon) => (
            <label
              key={addon}
              className="flex items-center gap-2 cursor-pointer rounded-md border p-2 hover:bg-accent transition-colors"
            >
              <Checkbox
                checked={adds.includes(addon)}
                onCheckedChange={() => toggleAddon(addon)}
              />
              <span className="text-sm">
                {ADDONS_EMOJIS[addon]} {t(`adds.${addon.replace(/ /g, "_")}`)}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
      >
        {isPending ? tGroup("adding") : tGroup("addOrder")}
      </Button>

      {/* Save Recipe (signed-in users only) */}
      {userId && (
        <>
          <Button
            type="button"
            variant="outline"
            onClick={() => setRecipeDialogOpen(true)}
            disabled={!kebabType || !sauce}
            className="w-full cursor-pointer"
          >
            <BookmarkPlus className="h-4 w-4 mr-2" />
            {tRecipe("save")}
          </Button>

          <Dialog open={recipeDialogOpen} onOpenChange={setRecipeDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{tRecipe("saveTitle")}</DialogTitle>
                <DialogDescription>{tRecipe("saveSubtitle")}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    {tRecipe("recipeName")}
                  </label>
                  <Input
                    placeholder={tRecipe("recipeNamePlaceholder")}
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    maxLength={50}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setRecipeDialogOpen(false)}
                  className="cursor-pointer"
                >
                  {tCommon("cancel")}
                </Button>
                <Button
                  onClick={handleSaveRecipe}
                  disabled={isSavingRecipe || !recipeName.trim()}
                  className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                >
                  {isSavingRecipe ? tCommon("loading") : tCommon("save")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

