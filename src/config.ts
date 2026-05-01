export interface Config {
    gameMode: GameModeConfig;
    capturePoint: CapturePointConfig;
    player: PlayerConfig;
    teams: TeamsConfig[];
    teamHQMapping: TeamHQMapping[];
}

export interface GameModeConfig {
    gameModeTargetScore: number;
    gameModeTimeLimit: number;
}

export interface CapturePointConfig {
    teamCaptureScore: number;
    playerCaptureScore: number;
}

export interface PlayerConfig {
    killScore: number;
}

export interface TeamsConfig {
    teamId: number,
}

export interface TeamHQMapping {
    teamId: number,
    hqId: number,
}

export const config: Config = {
    gameMode: {
        gameModeTargetScore: 50,
        gameModeTimeLimit: 600,
    },
    capturePoint: {
        teamCaptureScore: 10,
        playerCaptureScore: 300,
    },
    player: {
        killScore: 1,
    },
    teams: [
        { teamId: 1 },
        { teamId: 2 },
    ],
    teamHQMapping: [
        { teamId: 1, hqId: 301 },
        { teamId: 2, hqId: 302 },
    ],
};