import Image from "next/image";
import { useEffect, useState } from "react";
import { getAllPacks } from "../api/firebase";
import { Pack } from "../types";
import { Header, PackCard } from "../ui/components";
import { Grid } from "../ui/components/Grid/Grid";

export default function Home() {
  const [packs, setPacks] = useState<Array<Pack>>([]);

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
      <div className="wrapper">
        <Grid>
          {packs?.map((pack, key) => (
            <PackCard key={key} pack={pack} />
          ))}
        </Grid>
      </div>
    </>
  );
}
