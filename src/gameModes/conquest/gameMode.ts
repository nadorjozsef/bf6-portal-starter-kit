import { Events } from 'bf6-portal-utils/events';
import { PlayerManager } from '../../modules/player/playerManager';
import { TeamManager } from '../../modules/team/teamManager';
import { Player } from '../../modules/player/player';
import { convertArray } from '../../helpers';
import { gameModeConfig } from './config';
import { Timers } from 'bf6-portal-utils/timers';
import { CapturePointManager } from '../../modules/capturePoint/capturePointManager';
import { Team } from '../../modules/team/team';

export class GameMode {
    private static _instance: GameMode | undefined;

    private constructor(
        private _playerManager: PlayerManager,
        private _teamManager: TeamManager,
        private _capturePointManager: CapturePointManager
    ) {
        Events.OnGameModeStarted.subscribe(this.handleGameModeStarted.bind(this));
        Events.OnPlayerEarnedKill.subscribe(this.handlePlayerEarnedKill.bind(this));
        Events.OnCapturePointCaptured.subscribe(this.handleCapturePointCaptured.bind(this));
        this._teamManager.subscribeTeamsInitialized(this.handleTeamsInitialized.bind(this));
    }

    static GetInstance(
        playerManager: PlayerManager,
        teamManager: TeamManager,
        capturePointManager: CapturePointManager
    ): GameMode {
        if (!GameMode._instance) {
            GameMode._instance = new GameMode(playerManager, teamManager, capturePointManager);
        }
        return GameMode._instance;
    }

    private handleCapturePointCaptured(capturePoint: mod.CapturePoint): void {
        const previousOwnerTeam = mod.GetPreviousOwnerTeam(capturePoint);
        this._teamManager.getTeam(previousOwnerTeam).score = Math.max(
            0,
            this._teamManager.getTeam(previousOwnerTeam).score - gameModeConfig.teamCaptureScore
        );
        const modPlayersArray = mod.GetPlayersOnPoint(capturePoint);
        const modPlayers = convertArray<mod.Player>(modPlayersArray);
        for (const player of this._playerManager.getPlayers(modPlayers)) {
            player.score += gameModeConfig.playerCaptureScore;
        }
    }

    private startTicketBleedSystem(): void {
        const team1 = this._teamManager.getTeam(1);
        const team2 = this._teamManager.getTeam(2);
        Timers.setInterval(() => {
            const capturePoints = this._capturePointManager.getCapturePoints();
            const team1CapturePointCount = capturePoints.filter((cp) => cp.ownerTeamId === team1.id).length;
            const team2CapturePointCount = capturePoints.filter((cp) => cp.ownerTeamId === team2.id).length;
            if (team1CapturePointCount > team2CapturePointCount) {
                const ticketLoss = team1CapturePointCount - team2CapturePointCount;
                this.updateTeamScore(team2, ticketLoss);
            } else if (team2CapturePointCount > team1CapturePointCount) {
                const ticketLoss = team2CapturePointCount - team1CapturePointCount;
                this.updateTeamScore(team1, ticketLoss);
            }
        }, gameModeConfig.ticketBleedInterval * 1000);
    }

    private handleGameModeStarted(): void {
        mod.SetGameModeTimeLimit(gameModeConfig.timeLimit);
        mod.LoadMusic(mod.MusicPackages.Core);
        this.startTicketBleedSystem();
    }

    private handleTeamsInitialized(): void {
        const team1 = this._teamManager.getTeam(1);
        const team2 = this._teamManager.getTeam(2);
        team1.score = gameModeConfig.initialTickets;
        team2.score = gameModeConfig.initialTickets;
    }

    private handlePlayerEarnedKill(modPlayer: mod.Player, victim: mod.Player): void {
        if (modPlayer === victim) {
            return;
        }
        const player = this._playerManager.getPlayer(modPlayer);
        this.updatePlayerScore(player, gameModeConfig.playerKillScore);
        this.updateTeamScore(this._teamManager.getTeam(player.teamId === 1 ? 2 : 1), 1);
    }

    private updateTeamScore(team: Team, scoreChange: number): void {
        team.score = Math.max(0, team.score - scoreChange);
        const team1 = this._teamManager.getTeam(1);
        const team2 = this._teamManager.getTeam(2);
        // Todo: set winning, losing teams?, repeat?
        if (team1.score <= 5 || team2.score <= 5) {
            mod.PlayMusic(mod.MusicEvents.Core_LastPhaseBegin);
        }
        if (team1.score <= 0) {
            mod.EndGameMode(team2.modObject);
        } else if (team2.score <= 0) {
            mod.EndGameMode(team1.modObject);
        }
    }

    private updatePlayerScore(player: Player, scoreChange: number): void {
        player.kills++;
        player.score += scoreChange;
    }
}
