import type { NextPage } from "next";
import { Header, PackCard } from "../ui/components";

const Home: NextPage = () => {
  return (
    <>
      <Header />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1em",
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
