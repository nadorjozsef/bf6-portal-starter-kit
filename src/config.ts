export interface Config {
    gameMode: GameModeConfig;
    capturePoint: CapturePointConfig;
    player: PlayerConfig;
    teams: TeamsConfig[];
    restrictedAreas: RestrictedArea[];
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
    teamId: number;
}

export interface RestrictedArea {
    id: number;
    ownerTeamId?: number;
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
    teams: [{ teamId: 1 }, { teamId: 2 }],
    restrictedAreas: [
        { id: 301, ownerTeamId: 1 },
        { id: 302, ownerTeamId: 2 },
    ],
};
