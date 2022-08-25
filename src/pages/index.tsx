import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllPacks } from "../api/firebase";
import { RemotePuzzlePack } from "../types/puzzle_pack";
import { Header, PackCard } from "../ui/components";
import { Grid } from "../ui/components/Grid/Grid";

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
      <Image src="/img/home-large.jpg" height="10px" width="100%" />
      <div className="wrapper" style={{ color: "white" }}>
        <h1>
          Bienvenue sur Otapix
        </h1>
      </div>
      <div
        className="wrapper"
      >
        <Grid>
          {packs?.map((pack, key) => (
            <PackCard key={key} pack={pack} />
          ))}
        </Grid>
      </div>
    </>
  );
}
