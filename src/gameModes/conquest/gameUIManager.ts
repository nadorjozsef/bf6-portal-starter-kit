import { Events } from 'bf6-portal-utils/events';
import type { TeamManager } from '../../modules/team/teamManager';
import type { Team } from '../../modules/team/team';
import type { CapturePointManager } from '../../modules/capturePoint/capturePointManager';
import { gameModeConfig } from '../teamDeathmatch/gameModeConfig';
import { RestrictedAreaManager } from '../../modules/restrictedArea/restrictedAreaManager';
import { RedeployTimer } from '../../modules/restrictedArea/redeployTimer';
import type { ProgressTracker } from '../../modules/capturePoint/progressTracker';
import { teamScoreBars, teamScores } from '../../gameUI/teamScoreUI';
import { capturePoints, flagCaptureProgress } from '../../gameUI/capturePointUI';
import { restrictedAreaWarning } from '../../gameUI/restrictedAreaUI';

export class GameUIManager {
    private static _instance: GameUIManager | undefined;

    private constructor(
        private _teamManager: TeamManager,
        private _capturePointManager: CapturePointManager,
        private _restrictedAreaManager: RestrictedAreaManager
    ) {
        Events.OnGameModeStarted.subscribe(this.handleGameModeStarted.bind(this));
        this._restrictedAreaManager.subscribePlayerRegistered(this.handleRestrictedAreaPlayerRegistered.bind(this));
        this._capturePointManager.subscribePlayerRegistered(this.handleCapturePointManagerPlayerRegistered.bind(this));
    }

    static getInstance(
        teamManager: TeamManager,
        capturePointManager: CapturePointManager,
        restrictedAreas: RestrictedAreaManager
    ): GameUIManager {
        if (!GameUIManager._instance) {
            GameUIManager._instance = new GameUIManager(teamManager, capturePointManager, restrictedAreas);
        }
        return GameUIManager._instance;
    }

    private handleGameModeStarted(): void {
        const team1 = this._teamManager.getTeam(1);
        const team2 = this._teamManager.getTeam(2);
        this.showTeamScores(team1, team2);
        this.showTeamScoreBars(team1, team2);
        this.showCapturePoints(team1, team2);
    }

    private showTeamScores(team1: Team, team2: Team): void {
        teamScores(team1.modObject, team1.scoreAccessor, team2.scoreAccessor);
        teamScores(team2.modObject, team2.scoreAccessor, team1.scoreAccessor);
    }

    private showTeamScoreBars(team1: Team, team2: Team): void {
        const maxScore = gameModeConfig.targetScore;
        teamScoreBars(team1.modObject, team1.scoreAccessor, team2.scoreAccessor, maxScore);
        teamScoreBars(team2.modObject, team2.scoreAccessor, team1.scoreAccessor, maxScore);
    }

    private showCapturePoints(team1: Team, team2: Team): void {
        const capturePointsData = this._capturePointManager.getCapturePoints().map((capturePoint) => ({
            letter: capturePoint.letter,
            ownerTeamIdAccessor: capturePoint.ownerTeamIdAccessor,
            isCapturingAccessor: capturePoint.isCapturingAccessor,
        }));

        capturePoints(team1.modObject, capturePointsData);
        capturePoints(team2.modObject, capturePointsData);
    }

    private handleRestrictedAreaPlayerRegistered(modPlayer: mod.Player, redeployTimer: RedeployTimer): void {
        restrictedAreaWarning(modPlayer, redeployTimer.isActiveAccessor, redeployTimer.timeToRedeployAccessor);
    }

    private handleCapturePointManagerPlayerRegistered(modPlayer: mod.Player, progressTracker: ProgressTracker): void {
        flagCaptureProgress(
            modPlayer,
            progressTracker.letterAccessor,
            progressTracker.isActiveAccessor,
            progressTracker.friendlyPlayersCountAccessor,
            progressTracker.enemyPlayersCountAccessor,
            progressTracker.progressAccessor,
            progressTracker.currentOwnerTeamIdAccessor
        );
    }
}
