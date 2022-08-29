import { useState } from 'react'
import { SlotHelper } from '../../lib/utils'
import { LetterSlotsState } from '../../types'
import { GameStateContext } from '../contexts/GameStateContext'

export default function GameStateProvider({ children }: any) {
  const [currentProblemIndex, setCurrentProblemIndex] = useState<number>(0)
  const [gameSlots, setGameSlots] = useState<LetterSlotsState>({
    targetSlots: [],
    pickerSlots: [],
  })
  const [result, setResult] = useState<string>('')
  const slotsAreFull = SlotHelper.slotsAreFull(gameSlots.targetSlots)

  const data = {
    currentProblemIndex,
    gameSlots,
    result,
    slotsAreFull,
    setCurrentProblemIndex,
    setGameSlots,
    setResult,
  }

  return <GameStateContext.Provider value={data}>{children}</GameStateContext.Provider>
}
