import { Events } from 'bf6-portal-utils/events/index.ts';
import { config } from '../../config.ts';
import { RedeployTimer } from "./redeployTimer.ts";

type RegisterPlayerCallback = (player: mod.Player, timer: RedeployTimer) => void;

export class RestrictedAreaManager {
    private static _instance: RestrictedAreaManager | undefined;
    private _redeployTimers: RedeployTimer[] = [];
    private _registerPlayerCallbacks: RegisterPlayerCallback[] = [];

    private constructor() {
        Events.OnPlayerJoinGame.subscribe(this.handlePlayerJoinGame.bind(this));
        Events.OnPlayerLeaveGame.subscribe(this.handlePlayerLeaveGame.bind(this));
        Events.OnPlayerEnterAreaTrigger.subscribe(this.handlePlayerEnterArea.bind(this));
        Events.OnPlayerExitAreaTrigger.subscribe(this.handlePlayerExitArea.bind(this));
    }

    static getInstance(): RestrictedAreaManager {
        if (!RestrictedAreaManager._instance) {
            RestrictedAreaManager._instance = new RestrictedAreaManager();
        }
        return RestrictedAreaManager._instance;
    }

    public subscribePlayerRegistered(callback: (player: mod.Player, timer: RedeployTimer) => void): void {
        this._registerPlayerCallbacks.push(callback);
    }

    private handlePlayerJoinGame(modPlayer: mod.Player): void {
        const redeployTimer = new RedeployTimer(mod.GetObjId(modPlayer));
        this._redeployTimers.push(redeployTimer);
        for (const callback of this._registerPlayerCallbacks) {
            callback(modPlayer, redeployTimer);
        }
    }

    // todo remove callback
    private handlePlayerLeaveGame(playerId: number): void {
        const redeployTimer = this._redeployTimers.find(timer => timer.playerId === playerId);
        if (redeployTimer) {
            redeployTimer.reset();
            this._redeployTimers.splice(this._redeployTimers.indexOf(redeployTimer), 1);
        }
    }

    private handlePlayerEnterArea(modPlayer: mod.Player, modAreaTrigger: mod.AreaTrigger): void {
        if (!this.isRestrictiveAreaForPlayer(modPlayer, modAreaTrigger)) {
            return;
        }
        const redeployTimer = this._redeployTimers.find(timer => timer.playerId === mod.GetObjId(modPlayer));
        if (redeployTimer) {
            redeployTimer.start();
        }
    }

    private handlePlayerExitArea(modPlayer: mod.Player, modAreaTrigger: mod.AreaTrigger): void {
        if (!this.isRestrictiveAreaForPlayer(modPlayer, modAreaTrigger)) {
            return;
        }
        const redeployTimer = this._redeployTimers.find(timer => timer.playerId === mod.GetObjId(modPlayer));
        if (redeployTimer) {
            redeployTimer.reset();
        }
    }

    private isRestrictiveAreaForPlayer(modPlayer: mod.Player, modAreaTrigger: mod.AreaTrigger): boolean {
        const playerTeamId = mod.GetObjId(mod.GetTeam(modPlayer));
        const areaTriggerId = mod.GetObjId(modAreaTrigger);
        return config.restrictedAreas.some(restrictedArea => restrictedArea.id === areaTriggerId && restrictedArea.ownerTeamId !== playerTeamId);
    }
}
