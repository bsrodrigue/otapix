import { useEffect, useState } from "react";
import { getAllPacks } from "../api/firebase";
import { RemotePuzzlePack } from "../types/puzzle_pack";
import { Header, PackCard } from "../ui/components";

export default function Home() {
  const [packs, setPacks] = useState<Array<RemotePuzzlePack>>([]);

  useEffect(() => {
    async function getPacks() {
      const result = await getAllPacks();
      setPacks(result);
    }

    getPacks();
  }, []);

  return (
    <>
      <Header />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "2em",
          width: "100%",
        }}
        className="wrapper"
      >
        {packs?.map((pack, key) => (
          <PackCard key={key} pack={pack} />
        ))}
      </div>
    </>
  );
}
