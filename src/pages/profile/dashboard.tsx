import { useEffect, useState } from "react";
import { CgMenuRound } from "react-icons/cg";
import { submitGetUserPacks } from "../../api/app";
import { getPacksFromUser } from "../../api/firebase";
import PuzzleEditorProvider from "../../context/providers/editor/PuzzleEditorProvider";
import { useAuth } from "../../hooks";
import { useApi } from "../../hooks/useApi";
import { createPuzzlePackDraft } from "../../lib/utils";
import { Pack, Packs } from "../../types";
import { Fab } from "../../ui/components/Button/Fab";
import { PackEditor } from "../../ui/components/Editor/PackEditor";
import { EmptyPacks } from "../../ui/components/Misc/EmptyPacks";
import { DashboardSidePanel } from "../../ui/components/SidePanel/DashboardSidePanel";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [packs, setPacks] = useState<Packs>([]);
  const [currentPackIndex, setCurrentPackIndex] = useState(0);
  const [doGetUserPacks, getUserPacksIsLoading, userPacks] = useApi<
    typeof getPacksFromUser,
    Packs
  >(submitGetUserPacks);
  const { user } = useAuth();

  function addPuzzlePack() {
    if (!user) return;
    const pack: Pack = createPuzzlePackDraft(user.uid);
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
        loading={getUserPacksIsLoading}
        setSideBarIsOpen={setIsOpen}
        setCurrentPackIndex={setCurrentPackIndex}
        onCreatePackClick={addPuzzlePack}
      />

      {packs.length !== 0 && packs[currentPackIndex] && (
        <PuzzleEditorProvider>
          <PackEditor
            packs={packs}
            currentPackIndex={currentPackIndex}
            setPacks={setPacks}
          />
        </PuzzleEditorProvider>
      )}

      {packs.length === 0 && <EmptyPacks />}
      <Fab onClick={() => setIsOpen(!isOpen)}>
        <CgMenuRound />
      </Fab>
    </div>
  );
}
