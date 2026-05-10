import './configOverrides';
import { GameMode } from './gameMode';
import { GameUIManager } from './gameUIManager';
import { PlayerManager } from '../../modules/player/playerManager';
import { TeamManager } from '../../modules/team/teamManager';
import { Scoreboard } from '../../modules/scoreboard/scoreboard';
import { CapturePointManager } from '../../modules/capturePoint/capturePointManager';
import { ScoreboardManager } from '../../modules/scoreboard/scoreboardManager';
import { RestrictedAreaManager } from '../../modules/restrictedArea/restrictedAreaManager';

export function setupConquestMode(): void {
    const playerManager = PlayerManager.getInstance();
    const teamManager = TeamManager.getInstance();
    const capturePointManager = CapturePointManager.getInstance();
    GameMode.GetInstance(playerManager, teamManager);
    const restrictedAreas = RestrictedAreaManager.getInstance(playerManager);
    GameUIManager.getInstance(teamManager, capturePointManager, restrictedAreas);
    const scoreboard = Scoreboard.getInstance();
    ScoreboardManager.getInstance(scoreboard, playerManager);
}
