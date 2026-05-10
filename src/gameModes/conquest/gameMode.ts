import { Events } from 'bf6-portal-utils/events';
import { PlayerManager } from '../../modules/player/playerManager';
import { TeamManager } from '../../modules/team/teamManager';
import type { Player } from '../../modules/player/player';
import { convertArray } from '../../helpers';
import { gameModeConfig } from './config';
import { debug } from '../../debugTool/adminDebugTool';

export class GameMode {
    private static _instance: GameMode | undefined;

    private constructor(
        private _playerManager: PlayerManager,
        private _teamManager: TeamManager
    ) {
        Events.OnGameModeStarted.subscribe(this.handleGameModeStarted.bind(this));
        Events.OnPlayerEarnedKill.subscribe(this.handlePlayerEarnedKill.bind(this));
        Events.OnCapturePointCaptured.subscribe(this.handleCapturePointCaptured.bind(this));
        this._teamManager.subscribeTeamsInitialized(this.handleTeamsInitialized.bind(this));
    }

    static GetInstance(playerManager: PlayerManager, teamManager: TeamManager): GameMode {
        if (!GameMode._instance) {
            GameMode._instance = new GameMode(playerManager, teamManager);
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

    private handleGameModeStarted(): void {
        mod.SetGameModeTimeLimit(gameModeConfig.timeLimit);
        mod.LoadMusic(mod.MusicPackages.Core);
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
        this.updateTeamScore(player);
        this.updatePlayerScore(player);

        // Todo: set winning, losing teams?, repeat?
        const team1 = this._teamManager.getTeam(1);
        const team2 = this._teamManager.getTeam(2);
        if (team1.score === 5 || team2.score === 5) {
            mod.PlayMusic(mod.MusicEvents.Core_LastPhaseBegin);
        }
    }

    private updateTeamScore(player: Player) {
        const team1 = this._teamManager.getTeam(1);
        const team2 = this._teamManager.getTeam(2);
        if (player.teamId === 1) {
            team2.score--;
        } else if (player.teamId === 2) {
            team1.score--;
        }
        if (team1.score <= 0) {
            mod.EndGameMode(mod.GetTeam(2));
        } else if (team2.score <= 0) {
            mod.EndGameMode(mod.GetTeam(1));
        }
    }

    private updatePlayerScore(player: Player) {
        player.kills++;
        player.score += gameModeConfig.killScore;
    }
}
