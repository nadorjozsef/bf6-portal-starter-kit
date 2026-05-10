import './configOverrides';
import { GameMode } from './gameModes/conquest/gameMode';
import { PlayerManager } from './modules/player/playerManager';
import { TeamManager } from './modules/team/teamManager';
import { Scoreboard } from './modules/scoreboard/scoreboard';
import { CapturePointManager } from './modules/capturePoint/capturePointManager';
import { GameUIManager } from './gameModes/conquest/gameUIManager';
import { ScoreboardManager } from './modules/scoreboard/scoreboardManager';
import { RestrictedAreaManager } from './modules/restrictedArea/restrictedAreaManager';
import { debug } from './debugTool/adminDebugTool';

const playerManager = PlayerManager.getInstance();
const teamManager = TeamManager.getInstance();
const capturePointManager = CapturePointManager.getInstance();
GameMode.GetInstance(playerManager, teamManager);
const restrictedAreas = RestrictedAreaManager.getInstance(playerManager);
GameUIManager.getInstance(teamManager, capturePointManager, restrictedAreas);
const scoreboard = Scoreboard.getInstance();
ScoreboardManager.getInstance(scoreboard, playerManager);
