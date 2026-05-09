import { SolidUI } from 'bf6-portal-utils/solid-ui';

export class Player {
    private _scoreSignal = SolidUI.createSignal(0);
    private _killsSignal = SolidUI.createSignal(0);

    constructor(private _modPlayer: mod.Player) {}

    get id(): number {
        return mod.GetObjId(this._modPlayer);
    }

    get modObject(): mod.Player {
        return this._modPlayer;
    }

    get teamId(): number {
        return mod.GetObjId(mod.GetTeam(this._modPlayer));
    }

    get isAlive() {
        return mod.GetSoldierState(this._modPlayer, mod.SoldierStateBool.IsAlive);
    }

    get scoreAccessor(): SolidUI.Accessor<number> {
        return this._scoreSignal[0];
    }

    get score(): number {
        return this._scoreSignal[0]();
    }
    set score(value: number) {
        this._scoreSignal[1](value);
    }

    get killsAccessor(): SolidUI.Accessor<number> {
        return this._killsSignal[0];
    }

    get kills(): number {
        return this._killsSignal[0]();
    }
    set kills(value: number) {
        this._killsSignal[1](value);
    }

    public kill() {
        mod.Kill(this._modPlayer);
    }
}
