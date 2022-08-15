import { Difficulty } from "../enums";
import { PuzzlePack } from "../types";

export const mockPuzzlePacks: Array<PuzzlePack> = [
    {
        id: 1,
        cover: '/img/mock-packs/pack1.jpg',
        title: 'Pack Seven deadly sins',
        author: 'maelstrom',
        difficulty: Difficulty.E,
        puzzles: [
            {
                id: 1,
                word: 'Meliodas',
                universe: 'Nanatsu no Taizai',
                order: 1,
                pictures: ["", "", "", ""]
            }
        ]
    },
    {
        id: 2,
        cover: '/img/mock-packs/pack2.png',
        title: 'Pack Dragonball Super',
        author: 'burning_coder',
        difficulty: Difficulty.C,
        puzzles: [
            {
                id: 1,
                word: 'Vegeta',
                universe: 'Dragon Ball',
                order: 1,
                pictures: ["", "", "", ""]
            }
        ]
    },
    {
        id: 3,
        cover: '/img/mock-packs/pack3.jpeg',
        title: 'Pack Jujutsu Kaisen',
        author: 'ulrich_the_goat',
        difficulty: Difficulty.S,
        puzzles: [
            {
                id: 1,
                word: 'Nanami',
                universe: 'Jujuts Kaisen',
                order: 1,
                pictures: ["", "", "", ""]
            }
        ]
    },
]