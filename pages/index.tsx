import type { NextPage } from "next";
import { Header, PackCard } from "../ui/components";
import DifficultySelect from '../ui/components/Select/DifficultySelect/DifficultySelect';

const Home: NextPage = () => {
  return (
    <>
      <Header />
      <DifficultySelect />
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
