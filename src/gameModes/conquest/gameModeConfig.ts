export interface GameModeConfig {
    targetScore: number;
    initialTickets: number;
    timeLimit: number;
    ticketBleedInterval: number;
    teamCaptureScore: number; // game mode
    playerCaptureScore: number; // game mode
    killScore: number; // game mode
}

export const gameModeConfig: GameModeConfig = {
    targetScore: 50,
    initialTickets: 0,
    timeLimit: 600,
    ticketBleedInterval: 2,
    teamCaptureScore: 10,
    playerCaptureScore: 300,
    killScore: 1,
};

export function setGameModeOverrides(overrides: Partial<GameModeConfig>): void {
    Object.assign(gameModeConfig, overrides);
}
