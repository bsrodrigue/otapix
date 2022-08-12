import type { NextPage } from "next";
import { useState } from 'react';
import { Header, PackCard } from "../ui/components";
import DifficultyRadioGroup from '../ui/components/RadioGroup/DifficultyRadioGroup/DifficultyRadioGroup';

const DIFFICULTIES = ['F', 'E', 'D', 'C', 'B', 'A', 'S'];

const Home: NextPage = () => {
  const [checkedDifficulty, setCheckedDifficulty] = useState<string>("S");
  return (
    <>
      <Header />
      <div style={{ margin: "1em 0" }} className="wrapper">
        <h1 style={{ color: 'white' }}>Difficulty</h1>
        <DifficultyRadioGroup
          difficulties={DIFFICULTIES}
          checkedDifficulty={checkedDifficulty}
          setCheckedDifficulty={setCheckedDifficulty} />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "4em",
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

export default Home;
