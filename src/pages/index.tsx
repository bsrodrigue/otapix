import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { submitGetAllPacks } from "../api/app";
import { getAllPacks } from "../api/firebase";
import { useApi } from "../hooks/useApi";
import { Packs } from "../types";
import { Header, PackCard } from "../ui/components";
import { Footer } from "../ui/components/Footer";
import { Section } from "../ui/components/Section";
import { Welcome } from "../ui/components/Welcome";


export default function Home() {
  const [doGetAllPacks, getAllPacksIsLoading, packs] = useApi<
    typeof getAllPacks,
    Packs
  >(submitGetAllPacks);

  useEffect(() => {
    doGetAllPacks();
  }, [doGetAllPacks]);

  return (
    <>
      <Header />
      <Welcome />

      {/* Recommended packs */}
      <Section title="Recommended packs" primary>
        <div id="recommendations"></div>
        <div className="packcard-grid">
          {getAllPacksIsLoading ? (
            <Skeleton height={300} baseColor="#d61c4e" highlightColor="white" />
          ) : (
            <>
              {packs?.map((pack, key) => (
                <PackCard key={key} pack={pack} />
              ))}
            </>
          )}
        </div>
      </Section>
      <Section title="Why building this project?">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3em" }}>
          <div style={{ color: "white", flex: "1", fontSize: "1.3em" }}>
            <p>
              The goal of this project was quite simple: Challenging myself! But
              also, the idea of building a game like 4 pics 1 word targeted at a
              more geeky and weebish players persisted somewhere in the back of
              my mind. It was the perfect opportunity to make it a reality!
            </p>
            <br />
            <p>
              I had lots of fun (not always) building this project, although it
              is not 100% complete. I want to add more features as I get better
              at coding and players request more.
            </p>
            <br />
            <p>
              If you like what I am doing, do not mind giving me a ⭐ on{" "}
              <a
                className="primary"
                href="https://github.com/bsrodrigue/otapix"
              >
                github
              </a>{" "}
            </p>
          </div>
          <img
            style={{
              width: "100%",
              height: "22em",
              borderRadius: "1em",
              objectFit: "cover",
              objectPosition: "0 -1em",
            }}
            src="img/code-girl.png"
            alt=""
          />
        </div>
      </Section>
      <Footer />
    </>
  );
}
