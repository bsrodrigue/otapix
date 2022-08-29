import { useEffect, useState } from 'react';
import { getAllPacks } from '../api/firebase';
import { Pack } from '../types';
import { Header, PackCard } from '../ui/components';

export default function Home() {
  const [packs, setPacks] = useState<Array<Pack>>([]);

  useEffect(() => {
    async function getPacks() {
      const result = await getAllPacks();
      console.log(result);
      setPacks(result);
    }

    getPacks();
  }, []);

  return (
    <>
      <Header />
      <div style={{ padding: '1em' }} className="wrapper">
        <div className="packcard-grid">
          {packs?.map((pack, key) => (
            <PackCard key={key} pack={pack} />
          ))}
        </div>
      </div>
    </>
  );
}
