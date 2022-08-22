import Head from "next/head";
import { useEffect, useState } from 'react';
import { getAllPacks } from "../api/firebase";
import { Difficulty } from "../enums";
import { PuzzlePack } from "../types";
import { Header, PackCard } from "../ui/components";
import DifficultyRadioGroup from '../ui/components/RadioGroup/DifficultyRadioGroup/DifficultyRadioGroup';

export default function Home() {
  const [checkedDifficulty, setCheckedDifficulty] = useState<Difficulty>(Difficulty.F);
  const [packs, setPacks] = useState<Array<PuzzlePack>>([]);

  useEffect(() => {
    async function getPacks() {
      const result = await getAllPacks();
      console.log(result);
      setPacks(result)
    }

    getPacks();

  }, [])

  return (
    <>
      <Head>
        <title>Otapix</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <div style={{ marginBottom: "1em" }} className="wrapper">
        <h1 style={{ color: 'white' }}>Difficulty</h1>
        <small style={{ color: "white" }}>Select the difficulty of packages you want</small>
        <DifficultyRadioGroup
          checkedDifficulty={checkedDifficulty}
          setCheckedDifficulty={setCheckedDifficulty} />
      </div>
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
        {
          packs?.map((pack, key) => (
            <PackCard key={key} pack={pack} />
          ))
        }
      </div>
    </>
  );
};
