import { useEffect, useState } from "react";
import { CgMenuRound } from "react-icons/cg";
import { getPacksFromUser } from "../../api/firebase";
import { useAuth } from "../../hooks";
import { AppPacks } from "../../types";
import { Fab } from "../../ui/components/Button/Fab";
import { PackEditor } from "../../ui/components/Editor/PackEditor";
import { DashboardSidePanel } from "../../ui/components/SidePanel/DashboardSidePanel";

const initial: AppPacks = {
  local: [],
  remote: [],
};

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(true);
  const [currentPackIndex, setCurrentPackIndex] = useState(0);
  const [packs, setPacks] = useState<AppPacks>(initial);
  const [loading, setIsloading] = useState<boolean>(true);
  const { user } = useAuth();

  console.log(packs);

  function appPacksToArr(appPacks: AppPacks) {
    return [...appPacks.remote, ...appPacks.local];
  }

  const packsArr = appPacksToArr(packs);

  useEffect(() => {
    async function getPacks() {
      if (!user) return;
      try {
        setIsloading(true);
        const result = await getPacksFromUser(user.uid);
        console.log("Remote Packs: ", result);
        setPacks((prev) => {
          prev.remote = result;
          return prev;
        });
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
        packs={packsArr}
        setPacks={setPacks}
        currentPackIndex={currentPackIndex}
        setCurrentPackIndex={setCurrentPackIndex}
        loading={loading}
      />

      {
        packsArr.length !== 0 && (
          <>
            <PackEditor
              currentPack={packsArr[currentPackIndex]}
              setPacks={setPacks} />
            <Fab onClick={() => setIsOpen(!isOpen)}>
              <CgMenuRound />
            </Fab>
          </>
        )
      }

    </div>
  );
}
