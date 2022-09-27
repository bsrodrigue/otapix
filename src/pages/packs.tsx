import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { firstBatch, nextBatch } from "../api/firebase";
import { Packs } from "../types";
import { Header } from "../ui/components";
import PackCard from '../ui/components/Card/PackCard/PackCard';
import Section from '../ui/components/Section/Section';

export default function Search() {
    const router = useRouter();
    const [packs, setPacks] = useState<Packs>([]);
    const [lastKey, setLastKey] = useState("start");

    async function loadMore(key: string) {
        if (key) {
            const result = await nextBatch(key);
            setPacks(packs.concat(result.packs));
            setLastKey(result.lastKey);
        }

    }

    useEffect(() => {
        async function loadPacks() {
            const result = await firstBatch();
            setPacks(result.packs);
            setLastKey(result.lastKey);
        }

        loadPacks();

    }, [])


    return (

        <>
            <Header />
            <Section title="All Packs">
                <div style={{ height: "100vh", overflow: "auto" }}>

                    <InfiniteScroll
                        hasMore={Boolean(lastKey)}
                        loader={
                            <div style={{ color: "white", margin: "1em 0", textAlign: "center" }}>
                                <h1>Loading...</h1>
                            </div>
                        }
                        useWindow={false}
                        loadMore={(page: number) => {
                            loadMore(lastKey);

                        }}
                    >
                        <div className="packcard-grid">
                            {packs.map((pack, key) => (
                                <PackCard key={key} pack={pack} />
                            ))}
                        </div>
                    </InfiniteScroll>
                </div>
            </Section>
        </>
    )
}