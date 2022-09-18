import { useEffect, useState } from "react";
import { CgMenuRound } from "react-icons/cg";
import { AiOutlineHome } from "react-icons/ai";
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
import { useRouter } from "next/router";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [packs, setPacks] = useState<Packs>([]);
  const [currentPackIndex, setCurrentPackIndex] = useState(0);
  const [doGetUserPacks, getUserPacksIsLoading, userPacks] = useApi<
    typeof getPacksFromUser,
    Packs
  >(submitGetUserPacks);
  const { user } = useAuth();
  const router = useRouter();

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
    if (user) {
      doGetUserPacks(user.uid);
    }
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
      <Fab style={{ zIndex: "5", bottom: "3.5em" }} onClick={() => router.push("/")}>
        <AiOutlineHome />
      </Fab>
      <Fab onClick={() => setIsOpen(!isOpen)}>
        <CgMenuRound />
      </Fab>
    </div>
  );
}
