import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { db } from "../firebase";

function Home() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [groupId, setGroupId] = useState("");
  const [joining, setJoining] = useState(false);
  const [groupNotFound, setGroupNotFound] = useState(false);

  // Create a new group and redirect
  const createGroup = async () => {
    setCreating(true);
    const groupsCol = collection(db, "groups");
    const docRef = await addDoc(groupsCol, {
      createdAt: Date.now(),
      orders: [],
    });
    navigate(`/group/${docRef.id}`);
  };

  // Join an existing group by ID
  const joinGroup = async (e) => {
    e.preventDefault();
    if (!groupId) return;

    setJoining(true);
    setGroupNotFound(false);

    try {
      const groupsCol = collection(db, "groups");
      const snapshot = await getDocs(groupsCol);
      const groupDoc = snapshot.docs.find((doc) => doc.id === groupId);

      if (groupDoc) {
        navigate(`/group/${groupId}`);
      } else {
        setGroupNotFound(true);
        toast.error("Grupa s tim ID-om ne postoji!");
      }
    } catch {
      toast.error("Greška pri pretraživanju grupe.");
    } finally {
      setJoining(false);
    }
  };

  // Create a new group with the attempted group ID (optional)
  const createNewGroupInstead = async () => {
    setCreating(true);
    setGroupNotFound(false);
    const groupsCol = collection(db, "groups");
    const docRef = await addDoc(groupsCol, {
      createdAt: Date.now(),
      orders: [],
    });
    navigate(`/group/${docRef.id}`);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-orange-50 to-amber-100 dark:from-slate-900 dark:to-slate-800 px-4 py-8">
      <Toaster />
      <div className="w-full max-w-md relative">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-orange-600">
              City Kebab grupna narudžba
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Stvori ili pridruži se grupnoj narudžbi s prijateljima
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button
              onClick={createGroup}
              disabled={creating || joining}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base cursor-pointer"
              size="lg"
            >
              {creating ? "Stvaranje..." : "Stvori novu grupnu narudžbu"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="flex-grow h-px bg-border" />
              <span className="text-muted-foreground text-sm">ili</span>
              <div className="flex-grow h-px bg-border" />
            </div>

            <form onSubmit={joinGroup} className="space-y-4">
              <Input
                type="text"
                placeholder="Unesite ID grupe"
                value={groupId}
                onChange={(e) => {
                  setGroupId(e.target.value);
                  setGroupNotFound(false);
                }}
                className={`h-12 text-base ${
                  groupNotFound ? "border-destructive" : ""
                }`}
                disabled={joining || creating}
              />
              <Button
                type="submit"
                variant="outline"
                className="w-full h-12 text-base font-medium cursor-pointer"
                size="lg"
                disabled={joining || creating || !groupId}
              >
                {joining ? "Pretraživanje..." : "Pridruži se grupi"}
              </Button>

              {groupNotFound && (
                <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg dark:bg-red-950/50 dark:border-red-800/50 dark:backdrop-blur-sm">
                  <p className="text-sm text-red-600 text-center font-medium dark:text-red-400">
                    Grupa s ID-om "{groupId}" ne postoji.
                  </p>
                  <Button
                    onClick={createNewGroupInstead}
                    disabled={creating}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium cursor-pointer dark:bg-orange-600 dark:hover:bg-orange-700"
                    size="sm"
                  >
                    {creating
                      ? "Stvaranje..."
                      : "Stvori novu grupu umjesto toga"}
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
      <footer className="mt-8 text-xs text-muted-foreground text-center max-w-md">
        <p>
          Nije potrebna provjera autentičnosti. Podijelite vezu grupe s
          prijateljima!
        </p>
      </footer>
    </div>
  );
}

export default Home;

