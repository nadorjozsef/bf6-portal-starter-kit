import { Clocks } from "bf6-portal-utils/clocks";
import { SolidUI } from "bf6-portal-utils/solid-ui/index.ts";
import { PlayerManager } from "../player/playerManager.ts";
import { debug } from '../../debugTool/adminDebugTool.ts';

export class RedeployTimer {
    private _timeToRedeploy = SolidUI.createSignal(0);
    private _isActive = SolidUI.createSignal(false);

    constructor(private _playerId: number) { }

    get playerId(): number {
        return this._playerId;
    }

    get timeToRedeployAccessor(): SolidUI.Accessor<number> {
        return this._timeToRedeploy[0];
    }

    get isActiveAccessor(): SolidUI.Accessor<boolean> {
        return this._isActive[0];
    }

    public start() {
        this._redeployClock.start();
        this._isActive[1](true);
    }

    public reset() {
        this._redeployClock.reset();
        this._isActive[1](false);
    }

    private _redeployClock = new Clocks.CountDownClock(10, {
        onSecond: (seconds) => this.onSecond(seconds),
        onComplete: () => { this.onComplete() },
    });

    private onSecond(seconds: number): void {
        this._timeToRedeploy[1](seconds);
    }

    private onComplete(): void {
        this._isActive[1](false);
        const playerManager = PlayerManager.getInstance();
        playerManager.getPlayer(this._playerId).kill();
    }
}