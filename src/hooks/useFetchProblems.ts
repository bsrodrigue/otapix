import { useEffect, useState } from 'react';
import { getPack } from '../api/firebase';
import { Puzzles } from '../types';

export function useFetchProblems(packId: string) {
  const [problems, setProblems] = useState<Puzzles>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProblems() {
      try {
        setIsLoading(true);
        const packs = await getPack(packId);
        packs.puzzles && setProblems(packs.puzzles);
      } catch (error) {
        setProblems([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProblems();
  }, [packId]);

  return {
    problems,
    isLoading,
  };
}
