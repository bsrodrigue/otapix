import { useEffect, useState } from "react";
import { CgMenuRound } from "react-icons/cg";
import { getPacksFromUser } from "../../api/firebase";
import { useAuth } from "../../hooks";
import { useApi } from "../../hooks/useApi";
import { RequestNames } from "../../lib/errors";
import { notifyError } from "../../lib/notifications";
import { createPuzzlePack } from "../../lib/utils";
import { Pack, Packs } from "../../types";
import { Fab } from "../../ui/components/Button/Fab";
import { PackEditor } from "../../ui/components/Editor/PackEditor";
import { DashboardSidePanel } from "../../ui/components/SidePanel/DashboardSidePanel";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [packs, setPacks] = useState<Packs>([]);
  const [currentPackIndex, setCurrentPackIndex] = useState(0);
  const [doGetUserPacks, getUserPacksIsLoading, userPacks] = useApi<typeof getPacksFromUser, Packs>(getPacksFromUser, RequestNames.GET_USER_PACKS);
  const [loading, setIsloading] = useState(true);
  const { user } = useAuth();

  function addPuzzlePack() {
    if (!user) return;
    const pack: Pack = createPuzzlePack(user.uid);
    setPacks((prev) => {
      setCurrentPackIndex(prev.length);
      return [...prev, pack];
    });
    setIsOpen(false);
  }

  useEffect(() => {
    userPacks && setPacks(userPacks);
  }, [userPacks]);

  useEffect(() => {
    user && doGetUserPacks(user.uid);
  }, [user, doGetUserPacks]);

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
        <PackEditor currentPack={packs[currentPackIndex]} currentPackIndex={currentPackIndex} setPacks={setPacks} />
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
            <h1>Vous n&apos;avez pas de packs...</h1>
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
