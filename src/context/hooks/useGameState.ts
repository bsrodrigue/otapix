import { useContext } from 'react'
import { GameStateContext } from '../contexts/GameStateContext'

export default function useGameState() {
  const context = useContext(GameStateContext)

  if (context === undefined) {
    throw new Error('useGameState can only be used inside GameStateProvider')
  }

  return context
}
