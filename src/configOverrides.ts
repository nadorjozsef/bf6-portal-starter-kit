import { setGameModeOverrides } from './modules/gameMode/gameModeConfig';
import { setCapturePointOverrides } from './modules/capturePoint/capturePointConfig';
import { setTeamOverrides } from './modules/team/teamConfig';
import { setRestrictedAreaOverrides } from './modules/restrictedArea/restrictedAreaConfig';

setGameModeOverrides({
    targetScore: 50,
    initialTickets: 0, // not used
    timeLimit: 600,
    ticketBleedInterval: 2, // not used
    teamCaptureScore: 10,
    playerCaptureScore: 300,
    killScore: 1,
});

setTeamOverrides({
    objects: [{ teamId: 1 }, { teamId: 2 }],
});

setRestrictedAreaOverrides({
    redeployTime: 10,
});

setCapturePointOverrides({
    captureTime: 5,
    neutralizationTime: 3,
    maxCaptureMultiplier: 2,
});
