import { Events } from 'bf6-portal-utils/events';
import { CapturePoint } from './capturePoint';
import { convertArray } from '../../helpers';
import { ProgressTracker } from './progressTracker';

type RegisterPlayerCallback_2 = (player: mod.Player, progressTracker: ProgressTracker) => void;

export class CapturePointManager {
    private static _instance: CapturePointManager | undefined;
    private _capturePoints: CapturePoint[] = [];
    private _progressTracker: ProgressTracker[] = [];
    private _registerPlayerCallbacks: RegisterPlayerCallback_2[] = [];

    private constructor() {
        Events.OnGameModeStarted.subscribe(this.handleGameModeStarted.bind(this));
        Events.OnPlayerJoinGame.subscribe(this.handlePlayerJoinGame.bind(this));
        Events.OnPlayerLeaveGame.subscribe(this.handlePlayerLeaveGame.bind(this));
        Events.OnCapturePointCaptured.subscribe(this.handleCapturePointCaptured.bind(this));
        Events.OnCapturePointCapturing.subscribe(this.handleCapturePointCapturing.bind(this));
        Events.OnCapturePointLost.subscribe(this.handleCapturePointLost.bind(this));
        Events.OnPlayerEnterCapturePoint.subscribe(this.handlePlayerEnterCapturePoint.bind(this));
        Events.OnPlayerExitCapturePoint.subscribe(this.handlePlayerExitCapturePoint.bind(this));
    }

    static getInstance(): CapturePointManager {
        if (!CapturePointManager._instance) {
            CapturePointManager._instance = new CapturePointManager();
        }
        return CapturePointManager._instance;
    }

    public subscribePlayerRegistered(callback: RegisterPlayerCallback_2): void {
        this._registerPlayerCallbacks.push(callback);
    }


    public getCapturePoints(): CapturePoint[] {
        return this._capturePoints;
    }

    public getCapturePoint(modCapturePoint: mod.CapturePoint): CapturePoint;
    public getCapturePoint(capturePointId: number): CapturePoint;

    public getCapturePoint(capturePoint: number | mod.CapturePoint): CapturePoint {
        let capturePointId: number;
        if (typeof capturePoint === 'number') {
            capturePointId = capturePoint;
        } else {
            capturePointId = mod.GetObjId(capturePoint);
        }
        const found = this._capturePoints.find((capturePoint) => capturePoint.id === capturePointId);
        if (!found) {
            throw new Error(`Capture point not found for ID: ${capturePointId}`);
        }
        return found;
    }

    private handleGameModeStarted(): void {
        const modCapturePoints = convertArray<mod.CapturePoint>(mod.AllCapturePoints());
        for (const modCapturePoint of modCapturePoints) {
            this._capturePoints.push(new CapturePoint(modCapturePoint));
        }
        for (const capturePoint of this._capturePoints) {
            mod.EnableGameModeObjective(capturePoint.modObject, true);
            mod.SetCapturePointCapturingTime(capturePoint.modObject, 5);
            mod.SetCapturePointNeutralizationTime(capturePoint.modObject, 5);
            mod.SetMaxCaptureMultiplier(capturePoint.modObject, 1);
        }
    }

    private handlePlayerJoinGame(modPlayer: mod.Player): void {
        const progressTracker = new ProgressTracker(modPlayer);
        this._progressTracker.push(progressTracker);
        for (const callback of this._registerPlayerCallbacks) {
            callback(modPlayer, progressTracker);
        }
    }

    // todo remove callback
    private handlePlayerLeaveGame(playerId: number): void {
        const progressTracker = this._progressTracker.find(progress => progress.playerId === playerId);
        if (progressTracker) {
            progressTracker.playerExited();
            this._progressTracker.splice(this._progressTracker.indexOf(progressTracker), 1);
        }
    }

    private handleCapturePointCapturing(modCapturePoint: mod.CapturePoint): void {
        const capturePoint = this.getCapturePoint(modCapturePoint);
        capturePoint.isCapturing = true;
    }

    private handleCapturePointCaptured(modCapturePoint: mod.CapturePoint): void {
        const capturePoint = this.getCapturePoint(modCapturePoint);
        capturePoint.ownerTeamId = mod.GetObjId(mod.GetCurrentOwnerTeam(modCapturePoint));
        capturePoint.isCapturing = false;
    }

    private handlePlayerEnterCapturePoint(modPlayer: mod.Player, modCapturePoint: mod.CapturePoint): void {
        const capturePoint = this.getCapturePoint(modCapturePoint);
        capturePoint.playerEntered(modPlayer);
        const progressTracker = this._progressTracker.find(progressTracker => progressTracker.playerId === mod.GetObjId(modPlayer));
        progressTracker?.playerEntered(capturePoint);
    }

    private handlePlayerExitCapturePoint(modPlayer: mod.Player, modCapturePoint: mod.CapturePoint): void {
        const capturePoint = this.getCapturePoint(modCapturePoint);
        capturePoint.playerExited(modPlayer);
        const progressTracker = this._progressTracker.find(progressTracker => progressTracker.playerId === mod.GetObjId(modPlayer));
        progressTracker?.playerExited();
    }

    private handleCapturePointLost(modCapturePoint: mod.CapturePoint): void {
        const capturePoint = this.getCapturePoint(modCapturePoint);
        capturePoint.ownerTeamId = 0;
        capturePoint.isCapturing = false;
    }
}
