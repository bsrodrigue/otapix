import type { NextPage } from "next";
import Head from "next/head";
import { useState } from 'react';
import { Difficulty } from "../enums";
import { useAuth } from "../hooks";
import { Header, PackCard } from "../ui/components";
import DifficultyRadioGroup from '../ui/components/RadioGroup/DifficultyRadioGroup/DifficultyRadioGroup';

export default function Home() {
  const [checkedDifficulty, setCheckedDifficulty] = useState<Difficulty>(Difficulty.F);
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
        <PackCard />
        <PackCard />
        <PackCard />
        <PackCard />
      </div>
    </>
  );
};