import { Events } from 'bf6-portal-utils/events';
import type { TeamManager } from '../../modules/team/teamManager';
import type { Team } from '../../modules/team/team';
import { gameModeConfig } from './config';
import { renderTeamProgressionBarsWithTargetScore, renderTeamScores } from '../../UI/teamScoreUI';

export class GameUIManager {
    private static _instance: GameUIManager | undefined;

    private constructor(private _teamManager: TeamManager) {
        Events.OnGameModeStarted.subscribe(this.handleGameModeStarted.bind(this));
    }

    static getInstance(teamManager: TeamManager): GameUIManager {
        if (!GameUIManager._instance) {
            GameUIManager._instance = new GameUIManager(teamManager);
        }
        return GameUIManager._instance;
    }

    private handleGameModeStarted(): void {
        const team1 = this._teamManager.getTeam(1);
        const team2 = this._teamManager.getTeam(2);
        this.showTeamScores(team1, team2);
        this.showTeamScoreBars(team1, team2);
    }

    private showTeamScores(team1: Team, team2: Team): void {
        renderTeamScores(team1.modObject, team1.scoreAccessor, team2.scoreAccessor);
        renderTeamScores(team2.modObject, team2.scoreAccessor, team1.scoreAccessor);
    }

    private showTeamScoreBars(team1: Team, team2: Team): void {
        const gameModeTargetScore = gameModeConfig.targetScore;
        renderTeamProgressionBarsWithTargetScore(
            team1.modObject,
            team1.scoreAccessor,
            team2.scoreAccessor,
            gameModeTargetScore
        );
        renderTeamProgressionBarsWithTargetScore(
            team2.modObject,
            team2.scoreAccessor,
            team1.scoreAccessor,
            gameModeTargetScore
        );
    }
}
