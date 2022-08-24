import { useEffect, useState } from "react";
import { CgMenuRound } from "react-icons/cg";
import { getPacksFromUser } from "../../api/firebase";
import { useAuth } from "../../hooks";
import { notifyError } from "../../lib/notifications";
import { GlobalPacks } from "../../types";
import { Fab } from "../../ui/components/Button/Fab";
import { PackEditor } from "../../ui/components/Editor/PackEditor";
import { DashboardSidePanel } from "../../ui/components/SidePanel/DashboardSidePanel";

const initial: GlobalPacks = {
  local: [],
  remote: [],
};

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPackIndex, setCurrentPackIndex] = useState(0);
  const [packs, setPacks] = useState<GlobalPacks>(initial);
  const [loading, setIsloading] = useState<boolean>(true);
  const { user } = useAuth();

  function appPacksToArr(appPacks: GlobalPacks) {
    return [...appPacks.remote, ...appPacks.local];
  }

  const packsArr = appPacksToArr(packs);

  useEffect(() => {
    async function getPacks() {
      if (!user) return;
      try {
        setIsloading(true);
        const result = await getPacksFromUser(user.uid);
        setPacks((prev) => {
          prev.remote = result;
          return prev;
        });
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
        setSideBarIsOpen={setIsOpen}
        packs={packsArr}
        setPacks={setPacks}
        currentPackIndex={currentPackIndex}
        setCurrentPackIndex={setCurrentPackIndex}
        loading={loading}
      />

      {packsArr.length !== 0 && packsArr[currentPackIndex] && (
        <PackEditor
          currentPack={packsArr[currentPackIndex]}
          currentPackIndex={currentPackIndex}
          setPacks={setPacks}
        />
      )}

      {packsArr.length === 0 && (
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
