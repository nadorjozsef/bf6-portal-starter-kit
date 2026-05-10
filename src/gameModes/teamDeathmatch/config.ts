export interface GameModeConfig {
    targetScore: number;
    timeLimit: number;
    killScore: number;
}

export const gameModeConfig: GameModeConfig = {
    targetScore: 15,
    timeLimit: 600,
    killScore: 1,
};
