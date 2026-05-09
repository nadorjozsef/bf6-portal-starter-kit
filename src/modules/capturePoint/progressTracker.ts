import { Timers } from 'bf6-portal-utils/timers';
import { CapturePoint } from './capturePoint';
import { SolidUI } from 'bf6-portal-utils/solid-ui';
import { Events } from 'bf6-portal-utils/events';

export class ProgressTracker {
    private _capturePointId: number = 0;
    private _isActive = SolidUI.createSignal(false);
    private _friendlyPlayersCount = SolidUI.createSignal(0);
    private _enemyPlayersCount = SolidUI.createSignal(0);
    private _progress = SolidUI.createSignal(0);
    private _letter = SolidUI.createSignal('');
    private _intervalId: number | null = null;
    private _currentOwnerTeamId = SolidUI.createSignal(0);

    constructor(private _modPlayer: mod.Player) {
        Events.OnCapturePointCaptured.subscribe(this.handleCapturePointCaptured.bind(this));
        Events.OnCapturePointLost.subscribe(this.handleCapturePointLost.bind(this));
    }
    private handleCapturePointCaptured(modCapturePoint: mod.CapturePoint): void {
        if (this._capturePointId === mod.GetObjId(modCapturePoint)) {
            this._currentOwnerTeamId[1](mod.GetObjId(mod.GetCurrentOwnerTeam(modCapturePoint)));
        }
    }

    private handleCapturePointLost(modCapturePoint: mod.CapturePoint): void {
        if (this._capturePointId === mod.GetObjId(modCapturePoint)) {
            this._currentOwnerTeamId[1](mod.GetObjId(mod.GetCurrentOwnerTeam(modCapturePoint)));
        }
    }

    public playerEntered(capturePoint: CapturePoint) {
        this._capturePointId = capturePoint.id;
        const playersOnPoint = capturePoint.playersOnPoint;
        const playerTeamId = mod.GetObjId(mod.GetTeam(this._modPlayer));
        const friendlyPlayersCount = playersOnPoint.filter(
            (player) => mod.GetObjId(mod.GetTeam(player)) === playerTeamId
        ).length;
        const enemyPlayersCount = playersOnPoint.length - friendlyPlayersCount;

        this._currentOwnerTeamId[1](mod.GetObjId(mod.GetCurrentOwnerTeam(capturePoint.modObject)));
        this._intervalId = Timers.setInterval(
            () => {
                this._progress[1](mod.GetCaptureProgress(capturePoint.modObject));
            },
            50,
            true
        );
        this._friendlyPlayersCount[1](friendlyPlayersCount);
        this._enemyPlayersCount[1](enemyPlayersCount);
        this._letter[1](capturePoint.letter);
        this._isActive[1](true);
    }

    public playerExited() {
        this._capturePointId = 0;
        this._isActive[1](false);
        this._friendlyPlayersCount[1](0);
        this._enemyPlayersCount[1](0);
        Timers.clearInterval(this._intervalId);
        this._intervalId = null;
        this._letter[1]('');
        this._currentOwnerTeamId[1](0);
    }

    get playerId(): number {
        return mod.GetObjId(this._modPlayer);
    }

    get letterAccessor(): SolidUI.Accessor<string> {
        return this._letter[0];
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

    get currentOwnerTeamIdAccessor(): SolidUI.Accessor<number> {
        return this._currentOwnerTeamId[0];
    }
}
