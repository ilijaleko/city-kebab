import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { collection, getDocs, updateDoc } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { db } from "../firebase";

function Group() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [kebabType, setKebabType] = useState("");
  const [kebabSize, setKebabSize] = useState("");
  const [selectedAdds, setSelectedAdds] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [adding, setAdding] = useState(false);
  const [inputError, setInputError] = useState("");
  const kebabTypeRef = useRef(null);
  const [showSmsFormat, setShowSmsFormat] = useState(false);
  const [smsFormatCopied, setSmsFormatCopied] = useState(false);
  const [groupExists, setGroupExists] = useState(true);
  const [hasCheese, setHasCheese] = useState(false);
  const [sauce, setSauce] = useState("");

  const kebabTypes = [
    "pecivo",
    "tortilja",
    "vegetarijanski",
    "tortilja mix salata",
  ];

  const kebabSizes = ["mali", "veliki"];

  const sauceOptions = [
    "ljuti",
    "ljuti (malo manje)",
    "blagi",
    "blagi (malo manje)",
    "mix",
    "mix (malo manje)",
  ];

  const kebabAdds = [
    "luk",
    "rajčica",
    "zelena salata",
    "kupus",
    "kukuruz",
    "krastavci",
  ];

  const addonsEmojis = {
    luk: "🧅",
    rajčica: "🍅",
    "zelena salata": "🥬",
    kupus: "🥦",
    kukuruz: "🌽",
    krastavci: "🥒",
  };

  // Check if current kebab type should show size options
  const shouldShowSize =
    kebabType &&
    kebabType !== "tortilja mix salata" &&
    kebabType !== "vegetarijanski";

  // Check if current kebab type should show cheese option
  const shouldShowCheese =
    kebabType && (kebabType === "pecivo" || kebabType === "tortilja");

  // Detect if user is on mobile device
  const isMobile = () => {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) ||
      ("ontouchstart" in window && window.innerWidth < 768)
    );
  };

  // Reset size when kebab type changes
  useEffect(() => {
    if (!shouldShowSize) {
      setKebabSize("");
    }
  }, [kebabType, shouldShowSize]);

  // Reset cheese when kebab type changes
  useEffect(() => {
    if (!shouldShowCheese) {
      setHasCheese(false);
    }
  }, [kebabType, shouldShowCheese]);

  // Fetch group orders
  useEffect(() => {
    const fetchGroup = async () => {
      setLoading(true);
      const groupsCol = collection(db, "groups");
      const snapshot = await getDocs(groupsCol);
      const groupDoc = snapshot.docs.find((doc) => doc.id === groupId);
      if (groupDoc) {
        setOrders(groupDoc.data().orders || []);
        setGroupExists(true);
      } else {
        setGroupExists(false);
      }
      setLoading(false);
    };
    fetchGroup();
  }, [groupId]);

  // Add a new order
  const addOrder = async (e) => {
    e.preventDefault();
    setInputError("");
    if (!name.trim()) {
      setInputError("Molimo unesite ime.");
      return;
    }
    if (!kebabType) {
      setInputError("Molimo odaberite vrstu kebaba.");
      kebabTypeRef.current?.focus();
      return;
    }
    if (shouldShowSize && !kebabSize) {
      setInputError("Molimo odaberite veličinu.");
      return;
    }
    if (!sauce) {
      setInputError("Molimo odaberite umak.");
      return;
    }
    setAdding(true);
    const groupsCol = collection(db, "groups");
    const snapshot = await getDocs(groupsCol);
    const groupDoc = snapshot.docs.find((doc) => doc.id === groupId);
    if (groupDoc) {
      const newOrder = {
        id: Date.now().toString(),
        name,
        kebabType,
        kebabSize: shouldShowSize ? kebabSize : null,
        adds: selectedAdds,
        hasCheese: shouldShowCheese ? hasCheese : null,
        sauce: sauce,
      };
      const updatedOrders = [...(groupDoc.data().orders || []), newOrder];
      await updateDoc(groupDoc.ref, { orders: updatedOrders });
      setOrders(updatedOrders);
      setKebabType("");
      setKebabSize("");
      setSelectedAdds([]);
      setName("");
      setHasCheese(false);
      setSauce("");
      toast.success("Narudžba dodana!");
      kebabTypeRef.current?.focus();
    }
    setAdding(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Poveznica kopirana!");
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFooterCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Poveznica kopirana!");
  };

  // Format orders for SMS
  const formatOrdersForSms = () => {
    return orders
      .map((order, index) => {
        const orderNumber = index + 1;
        const kebabType = order.kebabType;
        const size = order.kebabSize ? `, ${order.kebabSize}` : "";
        const sauce = order.sauce ? `, ${order.sauce}` : "";

        // Combine regular addons with cheese information (excluding sauce)
        const allAddons = [];
        if (order.adds && order.adds.length > 0) {
          // Check if all kebab addons are selected
          const hasAllAddons = kebabAdds.every((addon) =>
            order.adds.includes(addon)
          );
          if (hasAllAddons && order.adds.length === kebabAdds.length) {
            allAddons.push("sve");
          } else {
            allAddons.push(...order.adds);
          }
        }
        if (order.hasCheese === true) {
          allAddons.push("sir");
        }

        const addons =
          allAddons.length > 0 ? `, dodaci: ${allAddons.join(", ")}` : "";
        const name = order.name ? `${order.name}` : "";

        return `${orderNumber}. ${kebabType}${size}${sauce}${addons} - ${name}`;
      })
      .join("\n");
  };

  const handleSmsFormatCopy = () => {
    const smsText = formatOrdersForSms();
    navigator.clipboard.writeText(smsText);
    setSmsFormatCopied(true);
    toast.success("SMS format kopiran!");
    setTimeout(() => setSmsFormatCopied(false), 1500);
  };

  const goBackToHome = () => {
    navigate("/");
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBackToHome}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Početna
          </Button>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-lg text-foreground">Učitavanje grupe...</p>
          </div>
        </div>
      </div>
    );
  if (!loading && !groupExists)
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBackToHome}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Početna
          </Button>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md mx-auto shadow-lg">
            <CardContent className="text-center py-12 px-6">
              <div className="text-6xl mb-6">🔍</div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Ups! Grupa nije pronađena
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Izgleda da ova grupa ne postoji ili je možda obrisana.
                Provjerite poveznicu ili stvorite novu grupu.
              </p>
              <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 sm:justify-center">
                <Button
                  onClick={goBackToHome}
                  className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                >
                  Idite na početnu
                </Button>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:text-white dark:border-orange-400 dark:hover:bg-orange-900/20 cursor-pointer"
                >
                  Pokušajte ponovo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 px-4 py-6">
      <Toaster />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={goBackToHome}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Početna
          </Button>
          <ThemeToggle />
        </div>
        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-xl sm:text-2xl font-bold text-orange-600">
                  Grupna narudžba
                </CardTitle>
                <CardDescription>
                  Dodajte svoju kebab narudžbu u grupu
                </CardDescription>
              </div>
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    ID grupe:
                  </span>
                  <code className="text-xs sm:text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded font-mono font-semibold">
                    {groupId}
                  </code>
                </div>
                <Button
                  onClick={handleCopy}
                  className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                  size="sm"
                >
                  {copied ? "Kopirano!" : "Kopiraj poveznicu"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Order Form */}
            <form onSubmit={addOrder} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Ime ili nadimak *
                  </label>
                  <Input
                    type="text"
                    placeholder="Vaše ime ili nadimak"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`h-11 w-full ${
                      inputError && !name ? "border-destructive" : ""
                    }`}
                    maxLength={30}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Vrsta kebaba *
                  </label>
                  <Select value={kebabType} onValueChange={setKebabType}>
                    <SelectTrigger
                      className={`h-11 w-full ${
                        inputError && !kebabType ? "border-destructive" : ""
                      }`}
                      ref={kebabTypeRef}
                    >
                      <SelectValue placeholder="Odaberite vrstu kebaba" />
                    </SelectTrigger>
                    <SelectContent>
                      {kebabTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Umak *
                  </label>
                  <Select value={sauce} onValueChange={setSauce}>
                    <SelectTrigger
                      className={`h-11 w-full ${
                        inputError && !sauce ? "border-destructive" : ""
                      }`}
                    >
                      <SelectValue placeholder="Odaberite umak" />
                    </SelectTrigger>
                    <SelectContent>
                      {sauceOptions.map((sauceOption) => (
                        <SelectItem key={sauceOption} value={sauceOption}>
                          {sauceOption.charAt(0).toUpperCase() +
                            sauceOption.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {shouldShowSize && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Veličina kebaba *
                    </label>
                    <Select value={kebabSize} onValueChange={setKebabSize}>
                      <SelectTrigger
                        className={`h-11 w-full ${
                          inputError && !kebabSize ? "border-destructive" : ""
                        }`}
                      >
                        <SelectValue placeholder="Odaberite veličinu" />
                      </SelectTrigger>
                      <SelectContent>
                        {kebabSizes.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {shouldShowCheese && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Sir 🧀
                    </label>
                    <Select
                      value={hasCheese ? "da" : "ne"}
                      onValueChange={(value) => setHasCheese(value === "da")}
                    >
                      <SelectTrigger className="h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ne">Ne</SelectItem>
                        <SelectItem value="da">Da</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Add-ons Selection */}
              {kebabType && (
                <Card className="bg-muted/30">
                  <CardContent>
                    <h4 className="text-sm font-medium text-foreground mb-4">
                      Dodaci (neobavezno):
                    </h4>
                    <div className="space-y-3">
                      {/* All addons checkbox */}
                      <div className="flex items-center space-x-2 pb-2 border-b border-border/50">
                        <Checkbox
                          id="all-addons"
                          checked={
                            selectedAdds.length === kebabAdds.length &&
                            kebabAdds.every((addon) =>
                              selectedAdds.includes(addon)
                            )
                          }
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedAdds([...kebabAdds]);
                            } else {
                              setSelectedAdds([]);
                            }
                          }}
                        />
                        <label
                          htmlFor="all-addons"
                          className="text-sm text-foreground font-medium cursor-pointer select-none"
                        >
                          ✨ Sve
                        </label>
                      </div>

                      {/* Individual addon checkboxes */}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {kebabAdds.map((add) => (
                          <div
                            key={add}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={add}
                              checked={selectedAdds.includes(add)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedAdds([...selectedAdds, add]);
                                } else {
                                  setSelectedAdds(
                                    selectedAdds.filter((item) => item !== add)
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={add}
                              className="text-sm text-foreground capitalize cursor-pointer select-none"
                            >
                              {addonsEmojis[add]} {add}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button
                type="submit"
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base cursor-pointer"
                size="lg"
                disabled={adding}
              >
                {adding ? "Dodavanje..." : "Dodaj narudžbu"}
              </Button>

              {inputError && (
                <p className="text-sm text-destructive text-center font-medium">
                  {inputError}
                </p>
              )}
            </form>

            {/* Orders List */}
            <div className="space-y-4">
              <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-semibold text-orange-600">
                  Narudžbe ({orders.length})
                </h3>
                {orders.length > 0 && (
                  <Button
                    onClick={() => setShowSmsFormat(true)}
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50 cursor-pointer"
                    size="sm"
                  >
                    📱 Generiraj SMS format
                  </Button>
                )}
              </div>
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🥙</div>
                      <p className="text-muted-foreground text-lg">
                        Još nema narudžbi. Budite prvi!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.map((order) => (
                        <Card
                          key={order.id}
                          className="bg-card transition-all duration-500"
                        >
                          <CardContent>
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center text-sm font-bold">
                                {order.name ? order.name[0].toUpperCase() : "A"}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-foreground truncate">
                                  {order.name || "Anoniman"}
                                </p>
                                <p className="text-sm text-muted-foreground capitalize">
                                  {order.kebabType}
                                  {order.kebabSize && ` - ${order.kebabSize}`}
                                  {order.hasCheese === true && " - sa sirom 🧀"}
                                  {order.sauce && ` - umak: ${order.sauce}`}
                                </p>
                                {order.adds && order.adds.length > 0 && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    +{" "}
                                    {(() => {
                                      const hasAllAddons = kebabAdds.every(
                                        (addon) => order.adds.includes(addon)
                                      );
                                      if (
                                        hasAllAddons &&
                                        order.adds.length === kebabAdds.length
                                      ) {
                                        return "✨ sve";
                                      } else {
                                        return order.adds
                                          .map(
                                            (add) =>
                                              `${addonsEmojis[add]} ${add}`
                                          )
                                          .join(", ");
                                      }
                                    })()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        <footer className="mt-8 text-xs text-muted-foreground text-center">
          <p
            onClick={handleFooterCopy}
            className="cursor-pointer hover:text-orange-600 transition-colors duration-200 hover:underline"
            title="Kliknite za kopiranje poveznice"
          >
            Pošalji ovu poveznicu prijateljima kako bi dodali svoj kebab u
            zajedničku narudžbu.
          </p>
        </footer>
      </div>

      {/* SMS Format Modal */}
      {showSmsFormat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-orange-600">
                  📱 SMS Format
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSmsFormat(false)}
                  className="cursor-pointer"
                >
                  ✕
                </Button>
              </div>
              <CardDescription>
                Kopirajte ovaj tekst i pošaljite SMS-om
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg max-h-60 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {formatOrdersForSms()}
                </pre>
              </div>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                <Button
                  onClick={handleSmsFormatCopy}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
                >
                  {smsFormatCopied ? "Kopirano!" : "Kopiraj u međuspremnik"}
                </Button>
                <Button
                  onClick={() => setShowSmsFormat(false)}
                  variant="outline"
                  className="flex-1 border-orange-300 text-orange-600 hover:bg-orange-50 cursor-pointer"
                >
                  Zatvori
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Group;

