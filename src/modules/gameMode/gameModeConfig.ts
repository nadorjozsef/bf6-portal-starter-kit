import { configOverrides } from '../../configOverrides.ts';

export interface GameModeConfig {
    targetScore: number;
    initialTickets: number;
    timeLimit: number;
    ticketBleedInterval: number;
    teamCaptureScore: number; // game mode
    playerCaptureScore: number; // game mode
    killScore: number; // game mode
}

const defaultConfig: GameModeConfig = {
    targetScore: 50,
    initialTickets: 0,
    timeLimit: 600,
    ticketBleedInterval: 2,
    teamCaptureScore: 10,
    playerCaptureScore: 300,
    killScore: 1,
};

export const gameModeConfig: GameModeConfig = {
    targetScore: configOverrides.gameMode?.targetScore ?? defaultConfig.targetScore,
    initialTickets: configOverrides.gameMode?.initialTickets ?? defaultConfig.initialTickets,
    timeLimit: configOverrides.gameMode?.timeLimit ?? defaultConfig.timeLimit,
    ticketBleedInterval: configOverrides.gameMode?.ticketBleedInterval ?? defaultConfig.ticketBleedInterval,
    teamCaptureScore: configOverrides.gameMode?.teamCaptureScore ?? defaultConfig.teamCaptureScore,
    playerCaptureScore: configOverrides.gameMode?.playerCaptureScore ?? defaultConfig.playerCaptureScore,
    killScore: configOverrides.gameMode?.killScore ?? defaultConfig.killScore,
};
