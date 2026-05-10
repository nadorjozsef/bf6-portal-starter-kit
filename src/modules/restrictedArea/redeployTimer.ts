import { Clocks } from 'bf6-portal-utils/clocks';
import { SolidUI } from 'bf6-portal-utils/solid-ui/index.ts';
import type { Player } from '../player/player.ts';
import { Sounds } from 'bf6-portal-utils/sounds';
import { mergedConfig } from './restrictedAreaConfig.ts';

export class RedeployTimer {
    private _timeToRedeploy = SolidUI.createSignal(0);
    private _isActive = SolidUI.createSignal(false);

    constructor(private _player: Player) {}

    get playerId(): number {
        return this._player.id;
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
        this.playSound();
    }

    public reset() {
        this._redeployClock.reset();
        this._isActive[1](false);
    }

    private _redeployClock = new Clocks.CountDownClock(mergedConfig.redeployTime, {
        onSecond: (seconds) => this.onSecond(seconds),
        onComplete: () => {
            this.onComplete();
        },
    });

    private onSecond(seconds: number): void {
        this._timeToRedeploy[1](seconds);
        if (seconds < mergedConfig.redeployTime) {
            this.playSound();
        }
    }

    private onComplete(): void {
        this._isActive[1](false);
        this._player.kill();
    }

    private playSound() {
        Sounds.Sound2D.play(mod.RuntimeSpawn_Common.SFX_UI_Gamemode_Shared_OutOfBounds_Countdown_OneShot2D, {
            amplitude: 0.7,
            target: this._player.modObject,
        });
    }
}
