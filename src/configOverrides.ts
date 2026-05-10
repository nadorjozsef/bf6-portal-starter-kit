import type { CapturePointConfig } from './modules/capturePoint/capturePointConfig';
import type { GameModeConfig } from './modules/gameMode/gameModeConfig';
import type { RestrictedAreaConfig } from './modules/restrictedArea/restrictedAreaConfig';
import type { TeamsConfig } from './modules/team/teamConfig';

export interface ConfigOverrides {
    gameMode?: Partial<GameModeConfig>;
    capturePoint?: Partial<CapturePointConfig>;
    team?: Partial<TeamsConfig>;
    restrictedArea?: Partial<RestrictedAreaConfig>;
}

export const configOverrides: ConfigOverrides = {
    gameMode: {
        targetScore: 50,
        initialTickets: 0, // Team manager
        timeLimit: 600,
        ticketBleedInterval: 2,
        teamCaptureScore: 10,
        playerCaptureScore: 300,
        killScore: 1, // game mode
    },
    team: {
        objects: [{ teamId: 1 }, { teamId: 2 }],
    },
    restrictedArea: {
        redeployTime: 10,
    },
    capturePoint: {
        captureTime: 5,
        neutralizationTime: 3,
        maxCaptureMultiplier: 2,
    },
};
