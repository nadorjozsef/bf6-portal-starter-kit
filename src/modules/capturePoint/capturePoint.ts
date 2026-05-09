import { SolidUI } from 'bf6-portal-utils/solid-ui';

export class CapturePoint {
    private _ownerTeamId = SolidUI.createSignal(0);
    private _isCapturing = SolidUI.createSignal(false);
    private _playersOnPoint: mod.Player[] = [];

    constructor(
        private _modCapturePoint: mod.CapturePoint,
        private _letter: string
    ) {}

    get id(): number {
        return mod.GetObjId(this._modCapturePoint);
    }

    get letter(): string {
        return this._letter;
    }

    get modObject(): mod.CapturePoint {
        return this._modCapturePoint;
    }

    get playersOnPoint(): mod.Player[] {
        return this._playersOnPoint;
    }

    public playerEntered(modPlayer: mod.Player): void {
        if (!this._playersOnPoint.includes(modPlayer)) {
            this._playersOnPoint.push(modPlayer);
        }
    }

    public playerExited(modPlayer: mod.Player): void {
        const index = this._playersOnPoint.findIndex((player) => mod.GetObjId(player) === mod.GetObjId(modPlayer));
        if (index !== -1) {
            this._playersOnPoint.splice(index, 1);
        }
    }

    get ownerTeamIdAccessor(): SolidUI.Accessor<number> {
        return this._ownerTeamId[0];
    }

    get ownerTeamId(): number {
        return this._ownerTeamId[0]();
    }
    set ownerTeamId(value: number) {
        this._ownerTeamId[1](value);
    }

    get isCapturingAccessor(): SolidUI.Accessor<boolean> {
        return this._isCapturing[0];
    }

    get isCapturing(): boolean {
        return this._isCapturing[0]();
    }
    set isCapturing(value: boolean) {
        this._isCapturing[1](value);
    }
}
