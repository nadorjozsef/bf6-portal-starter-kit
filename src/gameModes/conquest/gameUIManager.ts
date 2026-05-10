import type { TeamManager } from '../../modules/team/teamManager';
import type { Team } from '../../modules/team/team';
import type { CapturePointManager } from '../../modules/capturePoint/capturePointManager';
import { RestrictedAreaManager } from '../../modules/restrictedArea/restrictedAreaManager';
import { RedeployTimer } from '../../modules/restrictedArea/redeployTimer';
import type { ProgressTracker } from '../../modules/capturePoint/progressTracker';
import { renderTeamProgressionBars, renderTeamScores } from '../../UI/teamScoreUI';
import { renderAllCapturePoints, renderFlagCaptureProgress } from '../../UI/capturePointUI';
import { renderRestrictedAreaWarning } from '../../UI/restrictedAreaUI';
import { gameModeConfig } from './config';

export class GameUIManager {
    private static _instance: GameUIManager | undefined;

    private constructor(
        private _teamManager: TeamManager,
        private _capturePointManager: CapturePointManager,
        private _restrictedAreaManager: RestrictedAreaManager
    ) {
        this._restrictedAreaManager.subscribePlayerRegistered(this.handleRestrictedAreaPlayerRegistered.bind(this));
        this._capturePointManager.subscribePlayerRegistered(this.handleCapturePointManagerPlayerRegistered.bind(this));
        this._capturePointManager.subscribeCapturePointsInitialized(this.handleCapturePointsInitialized.bind(this));
        this._teamManager.subscribeTeamsInitialized(this.handleTeamsInitialized.bind(this));
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

    private handleTeamsInitialized(): void {
        const team1 = this._teamManager.getTeam(1);
        const team2 = this._teamManager.getTeam(2);
        this.showTeamScores(team1, team2);
        this.showTeamScoreBars(team1, team2);
    }

    private handleCapturePointsInitialized(): void {
        const team1 = this._teamManager.getTeam(1);
        const team2 = this._teamManager.getTeam(2);
        this.showCapturePoints(team1, team2);
    }

    private showTeamScores(team1: Team, team2: Team): void {
        renderTeamScores(team1.modObject, team1.scoreAccessor, team2.scoreAccessor);
        renderTeamScores(team2.modObject, team2.scoreAccessor, team1.scoreAccessor);
    }

    private showTeamScoreBars(team1: Team, team2: Team): void {
        const initialScore = gameModeConfig.initialTickets;
        renderTeamProgressionBars(team1.modObject, team1.scoreAccessor, team2.scoreAccessor, initialScore);
        renderTeamProgressionBars(team2.modObject, team2.scoreAccessor, team1.scoreAccessor, initialScore);
    }

    private showCapturePoints(team1: Team, team2: Team): void {
        const capturePointsData = this._capturePointManager.getCapturePoints().map((capturePoint) => ({
            letter: capturePoint.letter,
            ownerTeamIdAccessor: capturePoint.ownerTeamIdAccessor,
            isCapturingAccessor: capturePoint.isCapturingAccessor,
        }));
        renderAllCapturePoints(team1.modObject, capturePointsData);
        renderAllCapturePoints(team2.modObject, capturePointsData);
    }

    private handleRestrictedAreaPlayerRegistered(modPlayer: mod.Player, redeployTimer: RedeployTimer): void {
        renderRestrictedAreaWarning(modPlayer, redeployTimer.isActiveAccessor, redeployTimer.timeToRedeployAccessor);
    }

    private handleCapturePointManagerPlayerRegistered(modPlayer: mod.Player, progressTracker: ProgressTracker): void {
        renderFlagCaptureProgress(
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
