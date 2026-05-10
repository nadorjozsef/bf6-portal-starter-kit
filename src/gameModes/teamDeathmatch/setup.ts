import { GameMode } from './gameMode';
import { GameUIManager } from './gameUIManager';
import { PlayerManager } from '../../modules/player/playerManager';
import { TeamManager } from '../../modules/team/teamManager';
import { Scoreboard } from '../../modules/scoreboard/scoreboard';
import { ScoreboardManager } from '../../modules/scoreboard/scoreboardManager';

export function setupTeamDeathmatchMode(): void {
    const playerManager = PlayerManager.getInstance();
    const teamManager = TeamManager.getInstance();
    GameMode.GetInstance(playerManager, teamManager);
    GameUIManager.getInstance(teamManager);
    const scoreboard = Scoreboard.getInstance();
    ScoreboardManager.getInstance(scoreboard, playerManager);
}
