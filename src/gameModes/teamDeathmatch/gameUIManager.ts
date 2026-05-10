import { Events } from 'bf6-portal-utils/events';
import type { TeamManager } from '../../modules/team/teamManager';
import type { Team } from '../../modules/team/team';
import { gameModeConfig } from '../teamDeathmatch/gameModeConfig';
import { targetScore, teamScoreBarsTDM, teamScores } from '../../gameUI/teamScoreUI';

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
        this.showTargetScore(team1, team2);
    }

    private showTeamScores(team1: Team, team2: Team): void {
        teamScores(team1.modObject, team1.scoreAccessor, team2.scoreAccessor);
        teamScores(team2.modObject, team2.scoreAccessor, team1.scoreAccessor);
    }

    private showTeamScoreBars(team1: Team, team2: Team): void {
        const maxScore = gameModeConfig.targetScore;
        teamScoreBarsTDM(team1.modObject, team1.scoreAccessor, team2.scoreAccessor, maxScore);
        teamScoreBarsTDM(team2.modObject, team2.scoreAccessor, team1.scoreAccessor, maxScore);
    }

    private showTargetScore(team1: Team, team2: Team): void {
        const gamModeTargetScore = gameModeConfig.targetScore;
        targetScore(team1.modObject, gamModeTargetScore);
        targetScore(team2.modObject, gamModeTargetScore);
    }
}
