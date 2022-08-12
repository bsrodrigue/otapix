import type { NextPage } from "next";
import { Header, PackCard } from "../ui/components";
import DifficultyRadio from '../ui/components/Radio/DifficultyRadio/DifficultyRadio';

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <DifficultyRadio />
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
