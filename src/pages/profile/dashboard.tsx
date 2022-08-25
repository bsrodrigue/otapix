import { useEffect, useState } from "react";
import { CgMenuRound } from "react-icons/cg";
import { getPacksFromUser } from "../../api/firebase";
import { useAuth } from "../../hooks";
import { notifyError } from "../../lib/notifications";
import { createPuzzlePack } from "../../lib/utils";
import { Pack, Packs } from "../../types";
import { Fab } from "../../ui/components/Button/Fab";
import { PackEditor } from "../../ui/components/Editor/PackEditor";
import { DashboardSidePanel } from "../../ui/components/SidePanel/DashboardSidePanel";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPackIndex, setCurrentPackIndex] = useState(0);
  const [packs, setPacks] = useState<Packs>([]);
  const [loading, setIsloading] = useState(true);
  const { user } = useAuth();

  function addPuzzlePack() {
    if (!user) return;
    const pack: Pack = createPuzzlePack(user.uid);
    setPacks((prev) => {
      return [...prev, pack];
    });
    setIsOpen(false);
  }

  useEffect(() => {
    async function getPacks() {
      if (!user) return;
      try {
        setIsloading(true);
        const result = await getPacksFromUser(user.uid);
        setPacks(result);
      } catch (error) {
        notifyError("Erreur lors du chargement des packs");
        console.error(error);
      } finally {
        setIsloading(false);
      }
    }
    getPacks();
  }, [user]);

  return (
    <div className="dashboard-page">
      <DashboardSidePanel
        isOpen={isOpen}
        packs={packs}
        setPacks={setPacks}
        currentPackIndex={currentPackIndex}
        loading={loading}
        setSideBarIsOpen={setIsOpen}
        setCurrentPackIndex={setCurrentPackIndex}
        onCreatePackClick={addPuzzlePack}
      />

      {packs.length !== 0 && packs[currentPackIndex] && (
        <PackEditor
          currentPack={packs[currentPackIndex]}
          currentPackIndex={currentPackIndex}
          setPacks={setPacks}
        />
      )}

      {packs.length === 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            color: "white",
            textAlign: "center",
          }}
        >
          <div>
            <h1>Vous n'avez pas de packs...</h1>
            <small>Ouvrez le panneau pour creer un pack</small>
          </div>
        </div>
      )}
      <Fab onClick={() => setIsOpen(!isOpen)}>
        <CgMenuRound />
      </Fab>
    </div>
  );
}
