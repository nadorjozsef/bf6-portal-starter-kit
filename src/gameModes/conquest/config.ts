import { setCapturePointOverrides as overrideCapturePointConfig } from '../../modules/capturePoint/config';
import { setRestrictedAreaOverrides as overrideRestrictedAreaConfig } from '../../modules/restrictedArea/config';
import { setTeamOverrides as overrideTeamConfig } from '../../modules/team/config';

overrideTeamConfig({
    objects: [{ teamId: 1 }, { teamId: 2 }],
});

overrideRestrictedAreaConfig({
    redeployTime: 10,
});

overrideCapturePointConfig({
    captureTime: 5,
    neutralizationTime: 3,
    maxCaptureMultiplier: 2,
});

export interface GameModeConfig {
    initialTickets: number;
    timeLimit: number;
    ticketBleedInterval: number;
    teamCaptureScore: number;
    playerCaptureScore: number;
    playerKillScore: number;
}

export const gameModeConfig: GameModeConfig = {
    initialTickets: 50,
    timeLimit: 600,
    ticketBleedInterval: 10,
    teamCaptureScore: 10,
    playerCaptureScore: 300,
    playerKillScore: 1,
};
