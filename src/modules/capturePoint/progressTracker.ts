import { Timers } from 'bf6-portal-utils/timers';
import { CapturePoint } from './capturePoint';
import { SolidUI } from 'bf6-portal-utils/solid-ui';

export class ProgressTracker {
    private _isActive = SolidUI.createSignal(false);
    private _friendlyPlayersCount = SolidUI.createSignal(0);
    private _enemyPlayersCount = SolidUI.createSignal(0);
    private _progress = SolidUI.createSignal(0);
    private _intervalId: number | null = null;

    constructor(private _modPlayer: mod.Player) { }

    public playerEntered(capturePoint: CapturePoint) {
        const playersOnPoint = capturePoint.playersOnPoint;
        const playerTeamId = mod.GetObjId(mod.GetTeam(this._modPlayer));
        const friendlyPlayersCount = playersOnPoint.filter(player => mod.GetObjId(mod.GetTeam(player)) === playerTeamId).length;
        const enemyPlayersCount = playersOnPoint.length - friendlyPlayersCount;

        this._intervalId = Timers.setInterval(
            () => {
                this._progress[1](mod.GetCaptureProgress(capturePoint.modObject));
            }, 50, true
        );

        this._friendlyPlayersCount[1](friendlyPlayersCount);
        this._enemyPlayersCount[1](enemyPlayersCount);
        this._isActive[1](true);
    }

    public playerExited() {
        this._isActive[1](false);
        this._friendlyPlayersCount[1](0);
        this._enemyPlayersCount[1](0);
        Timers.clearInterval(this._intervalId);
        this._intervalId = null;
    }

    get playerId(): number {
        return mod.GetObjId(this._modPlayer);
    }

    get isActiveAccessor(): SolidUI.Accessor<boolean> {
        return this._isActive[0];
    }

    get friendlyPlayersCountAccessor(): SolidUI.Accessor<number> {
        return this._friendlyPlayersCount[0];
    }

    get enemyPlayersCountAccessor(): SolidUI.Accessor<number> {
        return this._enemyPlayersCount[0];
    }

    get progressAccessor(): SolidUI.Accessor<number> {
        return this._progress[0];
    }
}