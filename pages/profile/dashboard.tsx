import { useEffect, useState } from "react";
import { CgMenuRound } from "react-icons/cg";
import { getPacksFromUser } from "../../api/firebase";
import { useAuth } from "../../hooks";
import { PuzzlePack } from "../../types";
import { Fab } from "../../ui/components/Button/Fab";
import { PackEditor } from "../../ui/components/Editor/PackEditor";
import { DashboardSidePanel } from "../../ui/components/SidePanel/DashboardSidePanel";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPackIndex, setCurrentPackIndex] = useState(0);
  const [packs, setPacks] = useState<Array<PuzzlePack>>([]);
  const [loading, setIsloading] = useState<boolean>(true);

  const { user } = useAuth();

  useEffect(() => {
    async function getPacks() {
      if (!user) return;
      try {
        setIsloading(true);
        const result = await getPacksFromUser(user.uid);
        setPacks(result);
      } catch (error) {
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
        packs={packs}
        setPacks={setPacks}
        currentPackIndex={currentPackIndex}
        setCurrentPackIndex={setCurrentPackIndex}
        loading={loading}
      />
      <PackEditor currentPack={packs[currentPackIndex]} />
      <Fab onClick={() => setIsOpen(!isOpen)}>
        <CgMenuRound />
      </Fab>
    </div>
  );
}
