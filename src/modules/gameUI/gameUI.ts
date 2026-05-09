import { UI } from 'bf6-portal-utils/ui';
import { UIContainer } from 'bf6-portal-utils/ui/components/container';
import { UIText } from 'bf6-portal-utils/ui/components/text';
import { SolidUI } from 'bf6-portal-utils/solid-ui';
import { Timers } from 'bf6-portal-utils/timers';

interface TeamScoreProps {
    x: number;
    darkColor: mod.Vector;
    brightColor: mod.Vector;
}

interface TeamScoreBarProps {
    backgroundColor: mod.Vector;
    foregroundColor: mod.Vector;
    progressionType: 'shrinking' | 'growing';
    progressionDirection: 'leftToRight' | 'rightToLeft';
    maxScore: number;
}

interface CapturePointData {
    letter: string;
    ownerTeamIdAccessor: SolidUI.Accessor<number>;
    isCapturingAccessor: SolidUI.Accessor<boolean>;
}

function getStringKeyForLetter(letter: string): string {
    switch (letter) {
        case 'A':
            return mod.stringkeys.gameUI.capturePointA;
        case 'B':
            return mod.stringkeys.gameUI.capturePointB;
        case 'C':
            return mod.stringkeys.gameUI.capturePointC;
        case 'D':
            return mod.stringkeys.gameUI.capturePointD;
        case 'E':
            return mod.stringkeys.gameUI.capturePointE;
        case 'F':
            return mod.stringkeys.gameUI.capturePointF;
        case 'G':
            return mod.stringkeys.gameUI.capturePointG;
        default:
            return '';
    }
}

export class GameUI {
    private static _instance: GameUI | undefined;

    private constructor() {}

    static getInstance(): GameUI {
        if (!GameUI._instance) {
            GameUI._instance = new GameUI();
        }
        return GameUI._instance;
    }

    public flagCaptureProgress(
        player: mod.Player,
        letterAccessor: SolidUI.Accessor<string>,
        isActiveAccessor: SolidUI.Accessor<boolean>,
        friendlyPlayersCountAccessor: SolidUI.Accessor<number>,
        enemyPlayersCountAccessor: SolidUI.Accessor<number>,
        progressAccessor: SolidUI.Accessor<number>,
        currentOwnerTeamIdAccessor: SolidUI.Accessor<number>
    ): void {
        const mainContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 170 },
            size: { width: 60, height: 60 },
            bgFill: mod.UIBgFill.None,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopCenter,
            receiver: player,
        });
        this.playerProgressBars(
            mainContainer,
            player,
            isActiveAccessor,
            progressAccessor,
            enemyPlayersCountAccessor,
            friendlyPlayersCountAccessor
        );
        this.bigBlueCircleCapturePoint(
            mainContainer,
            player,
            isActiveAccessor,
            letterAccessor,
            progressAccessor,
            currentOwnerTeamIdAccessor,
            enemyPlayersCountAccessor
        );
        this.bigBlueSquareCapturePoint(
            mainContainer,
            player,
            isActiveAccessor,
            letterAccessor,
            progressAccessor,
            currentOwnerTeamIdAccessor
        );
        this.bigRedSquareCapturePoint(
            mainContainer,
            player,
            isActiveAccessor,
            letterAccessor,
            progressAccessor,
            currentOwnerTeamIdAccessor
        );
    }

    private playerProgressBars(
        parent: UIContainer,
        modPlayer: mod.Player,
        isActiveAccessor: SolidUI.Accessor<boolean>,
        progressAccessor: SolidUI.Accessor<number>,
        enemyPlayersCountAccessor: SolidUI.Accessor<number>,
        friendlyPlayersCountAccessor: SolidUI.Accessor<number>
    ): void {
        const playersContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 50 },
            size: { width: 90, height: 6 },
            visible: () => isActiveAccessor() && (progressAccessor() < 1 || enemyPlayersCountAccessor() > 0),
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: parent,
            receiver: modPlayer,
        });
        // friendly players bar
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 90, height: 6 },
            bgFill: mod.UIBgFill.Solid,
            bgColor: UI.COLORS.BF_BLUE_BRIGHT,
            visible: () => isActiveAccessor() && (progressAccessor() < 1 || enemyPlayersCountAccessor() > 0),
            bgAlpha: 1,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.CenterLeft,
            parent: playersContainer,
            receiver: modPlayer,
        });
        // enemy players bar
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            width:
                90 *
                (enemyPlayersCountAccessor() / (friendlyPlayersCountAccessor() + enemyPlayersCountAccessor()) || 0),
            height: 6,
            bgFill: mod.UIBgFill.Solid,
            bgColor: UI.COLORS.BF_RED_BRIGHT,
            visible: () => isActiveAccessor() && (progressAccessor() < 1 || enemyPlayersCountAccessor() > 0),
            bgAlpha: 1,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.CenterRight,
            parent: playersContainer,
            receiver: modPlayer,
        });
        // friendly players text
        SolidUI.h(UIText, {
            message: () => mod.Message(mod.stringkeys.gameUI.friendlyPlayersText, friendlyPlayersCountAccessor()),
            position: { x: -60, y: 0 },
            textSize: 22,
            width: 24,
            visible: () => isActiveAccessor() && (progressAccessor() < 1 || enemyPlayersCountAccessor() > 0),
            textColor: UI.COLORS.BF_BLUE_BRIGHT,
            textAlpha: 1,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: playersContainer,
            receiver: modPlayer,
        });
        // enemy players text
        SolidUI.h(UIText, {
            message: () => mod.Message(mod.stringkeys.gameUI.enemyPlayersText, enemyPlayersCountAccessor()),
            position: { x: 60, y: 0 },
            textSize: 22,
            width: 24,
            visible: () => isActiveAccessor() && (progressAccessor() < 1 || enemyPlayersCountAccessor() > 0),
            textColor: UI.COLORS.BF_RED_BRIGHT,
            textAlpha: 1,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: playersContainer,
            receiver: modPlayer,
        });
    }

    private bigBlueCircleCapturePoint(
        parent: UIContainer,
        modPlayer: mod.Player,
        isActiveAccessor: SolidUI.Accessor<boolean>,
        letterAccessor: SolidUI.Accessor<string>,
        progressAccessor: SolidUI.Accessor<number>,
        currentOwnerTeamIdAccessor: SolidUI.Accessor<number>,
        enemyPlayersCountAccessor: SolidUI.Accessor<number>
    ): void {
        const mainContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 60, height: 60 },
            bgFill: mod.UIBgFill.None,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() === 1 &&
                currentOwnerTeamIdAccessor() === mod.GetObjId(mod.GetTeam(modPlayer)) &&
                enemyPlayersCountAccessor() === 0,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: parent,
            receiver: modPlayer,
        });
        // outer circle
        SolidUI.h(UIText, {
            message: mod.Message(mod.stringkeys.gameUI.circle),
            textSize: 60,
            width: 60,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() === 1 &&
                currentOwnerTeamIdAccessor() === mod.GetObjId(mod.GetTeam(modPlayer)) &&
                enemyPlayersCountAccessor() === 0,
            textColor: UI.COLORS.BF_BLUE_BRIGHT,
            textAlpha: 0.75,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: mainContainer,
            receiver: modPlayer,
        });
        // inner circle
        SolidUI.h(UIText, {
            message: mod.Message(mod.stringkeys.gameUI.circle),
            textSize: 54,
            width: 54,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() === 1 &&
                currentOwnerTeamIdAccessor() === mod.GetObjId(mod.GetTeam(modPlayer)) &&
                enemyPlayersCountAccessor() === 0,
            textColor: UI.COLORS.BF_BLUE_DARK,
            textAlpha: 0.75,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: mainContainer,
            receiver: modPlayer,
        });
        // letter
        SolidUI.h(UIText, {
            message: () => mod.Message(getStringKeyForLetter(letterAccessor())),
            textSize: 36,
            width: 44,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() === 1 &&
                currentOwnerTeamIdAccessor() === mod.GetObjId(mod.GetTeam(modPlayer)) &&
                enemyPlayersCountAccessor() === 0,
            textColor: UI.COLORS.BF_BLUE_BRIGHT,
            textAlpha: 1,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: mainContainer,
            receiver: modPlayer,
        });
    }

    private bigBlueSquareCapturePoint(
        parent: UIContainer,
        modPlayer: mod.Player,
        isActiveAccessor: SolidUI.Accessor<boolean>,
        letterAccessor: SolidUI.Accessor<string>,
        progressAccessor: SolidUI.Accessor<number>,
        currentOwnerTeamIdAccessor: SolidUI.Accessor<number>
    ): UIContainer {
        const mainContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 50, height: 50 },
            bgFill: mod.UIBgFill.None,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() < 1 &&
                (currentOwnerTeamIdAccessor() === mod.GetObjId(mod.GetTeam(modPlayer)) ||
                    currentOwnerTeamIdAccessor() === 0),
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: parent,
            receiver: modPlayer,
        });
        // outer square
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 50, height: 50 },
            bgColor: UI.COLORS.BF_BLUE_BRIGHT,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 0.75,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() < 1 &&
                (currentOwnerTeamIdAccessor() === mod.GetObjId(mod.GetTeam(modPlayer)) ||
                    currentOwnerTeamIdAccessor() === 0),
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: mainContainer,
            receiver: modPlayer,
        });
        // inner square
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 46, height: 46 },
            bgColor: UI.COLORS.BF_BLUE_DARK,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 0.75,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() < 1 &&
                (currentOwnerTeamIdAccessor() === mod.GetObjId(mod.GetTeam(modPlayer)) ||
                    currentOwnerTeamIdAccessor() === 0),
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: mainContainer,
            receiver: modPlayer,
        });
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 2 },
            height: () => 48 * progressAccessor(),
            width: 46,
            bgColor: UI.COLORS.BF_BLUE_BRIGHT,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 0.5,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() < 1 &&
                (currentOwnerTeamIdAccessor() === mod.GetObjId(mod.GetTeam(modPlayer)) ||
                    currentOwnerTeamIdAccessor() === 0),
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.BottomCenter,
            parent: mainContainer,
            receiver: modPlayer,
        });
        // letter
        SolidUI.h(UIText, {
            message: () => mod.Message(getStringKeyForLetter(letterAccessor())),
            textSize: 36,
            width: 44,
            textColor: UI.COLORS.BF_BLUE_BRIGHT,
            textAlpha: 1,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() < 1 &&
                (currentOwnerTeamIdAccessor() === mod.GetObjId(mod.GetTeam(modPlayer)) ||
                    currentOwnerTeamIdAccessor() === 0),
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: mainContainer,
            receiver: modPlayer,
        });

        return mainContainer;
    }

    private bigRedSquareCapturePoint(
        parent: UIContainer,
        modPlayer: mod.Player,
        isActiveAccessor: SolidUI.Accessor<boolean>,
        letterAccessor: SolidUI.Accessor<string>,
        progressAccessor: SolidUI.Accessor<number>,
        currentOwnerTeamIdAccessor: SolidUI.Accessor<number>
    ): UIContainer {
        const mainContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 50, height: 50 },
            bgFill: mod.UIBgFill.None,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() < 1 &&
                currentOwnerTeamIdAccessor() !== mod.GetObjId(mod.GetTeam(modPlayer)) &&
                currentOwnerTeamIdAccessor() !== 0,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: parent,
            receiver: modPlayer,
        });
        // outer square
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 50, height: 50 },
            bgColor: UI.COLORS.BF_RED_BRIGHT,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 0.75,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() < 1 &&
                currentOwnerTeamIdAccessor() !== mod.GetObjId(mod.GetTeam(modPlayer)) &&
                currentOwnerTeamIdAccessor() !== 0,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: mainContainer,
            receiver: modPlayer,
        });
        // inner square
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 46, height: 46 },
            bgColor: UI.COLORS.BF_RED_DARK,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 0.75,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() < 1 &&
                currentOwnerTeamIdAccessor() !== mod.GetObjId(mod.GetTeam(modPlayer)) &&
                currentOwnerTeamIdAccessor() !== 0,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: mainContainer,
            receiver: modPlayer,
        });
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 2 },
            height: () => 48 * (1 - progressAccessor()),
            width: 46,
            bgColor: UI.COLORS.BF_RED_DARK,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 0.5,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() < 1 &&
                currentOwnerTeamIdAccessor() !== mod.GetObjId(mod.GetTeam(modPlayer)) &&
                currentOwnerTeamIdAccessor() !== 0,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopCenter,
            parent: mainContainer,
            receiver: modPlayer,
        });
        // letter
        SolidUI.h(UIText, {
            message: () => mod.Message(getStringKeyForLetter(letterAccessor())),
            textSize: 36,
            width: 44,
            textColor: UI.COLORS.BF_RED_BRIGHT,
            textAlpha: 1,
            visible: () =>
                isActiveAccessor() &&
                progressAccessor() < 1 &&
                currentOwnerTeamIdAccessor() !== mod.GetObjId(mod.GetTeam(modPlayer)) &&
                currentOwnerTeamIdAccessor() !== 0,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: mainContainer,
            receiver: modPlayer,
        });

        return mainContainer;
    }

    public capturePoints(modTeam: mod.Team, capturePoints: CapturePointData[]): void {
        const numberOfCapturePoints = capturePoints.length;
        const boxWidth = 32;
        const gap = 20;
        const step = boxWidth + gap;
        const totalWidth = numberOfCapturePoints * step;
        const start = -totalWidth / 2 + step / 2;
        const capturePointXPositions: number[] = [];
        for (let i = 0; i < numberOfCapturePoints; i++) {
            capturePointXPositions.push(start + i * step);
        }
        for (let i = 0; i < numberOfCapturePoints; i++) {
            this.capturePoint(
                modTeam,
                capturePoints[i].ownerTeamIdAccessor,
                capturePoints[i].isCapturingAccessor,
                capturePoints[i].letter,
                capturePointXPositions[i]
            );
        }
    }

    private capturePoint(
        modTeam: mod.Team,
        ownerTeamIdAccessor: SolidUI.Accessor<number>,
        isCapturingAccessor: SolidUI.Accessor<boolean>,
        letter: string,
        xPosition: number
    ): void {
        const [alphaSignal, setAlphaSignal] = SolidUI.createSignal(1);
        let intervalId: number | null = null;

        SolidUI.createEffect(() => {
            if (isCapturingAccessor() === true && intervalId === null) {
                let change = 0.1;
                intervalId = Timers.setInterval(
                    () => {
                        setAlphaSignal((prev) => {
                            if (prev <= 0 || prev >= 1) change *= -1;
                            const roundnewAlpha = Math.round((prev + change) * 100) / 100;
                            return roundnewAlpha;
                        });
                    },
                    50,
                    true
                );
            } else {
                Timers.clearInterval(intervalId);
                setAlphaSignal(1);
                intervalId = null;
            }
        });

        const mainContainer = SolidUI.h(UIContainer, {
            x: xPosition,
            y: 95,
            size: { width: 32, height: 32 },
            bgFill: mod.UIBgFill.None,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopCenter,
            receiver: modTeam,
        });

        const blueCapturePoint = this.blueCapturePoint(modTeam, mainContainer, alphaSignal, letter);
        const grayCapturePoint = this.grayCapturePoint(modTeam, mainContainer, alphaSignal, letter);
        const redCapturePoint = this.redCapturePoint(modTeam, mainContainer, alphaSignal, letter);

        SolidUI.createEffect(() => {
            if (ownerTeamIdAccessor() === 0) {
                blueCapturePoint.hide();
                redCapturePoint.hide();
                grayCapturePoint.show();
            } else if (ownerTeamIdAccessor() === 1) {
                if (mod.GetObjId(modTeam) === 1) {
                    blueCapturePoint.show();
                    redCapturePoint.hide();
                } else if (mod.GetObjId(modTeam) === 2) {
                    blueCapturePoint.hide();
                    redCapturePoint.show();
                }
                grayCapturePoint.hide();
            } else if (ownerTeamIdAccessor() === 2) {
                if (mod.GetObjId(modTeam) === 1) {
                    blueCapturePoint.hide();
                    redCapturePoint.show();
                } else if (mod.GetObjId(modTeam) === 2) {
                    blueCapturePoint.show();
                    redCapturePoint.hide();
                }
                grayCapturePoint.hide();
            }
        });
    }

    private blueCapturePoint(
        modTeam: mod.Team,
        parent: UIContainer,
        alphaSignalAccessor: SolidUI.Accessor<number>,
        letter: string
    ): UIContainer {
        const circleContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 32, height: 32 },
            bgFill: mod.UIBgFill.None,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: parent,
            receiver: modTeam,
        });
        // outer circle
        SolidUI.h(UIText, {
            message: mod.Message(mod.stringkeys.gameUI.circle),
            textSize: 40,
            width: 40,
            textColor: UI.COLORS.BF_BLUE_BRIGHT,
            textAlpha: () => alphaSignalAccessor() * 0.75,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: circleContainer,
            receiver: modTeam,
        });
        // inner circle
        SolidUI.h(UIText, {
            message: mod.Message(mod.stringkeys.gameUI.circle),
            textSize: 37,
            width: 37,
            textColor: UI.COLORS.BF_BLUE_DARK,
            textAlpha: () => alphaSignalAccessor() * 0.75,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: circleContainer,
            receiver: modTeam,
        });
        // letter
        SolidUI.h(UIText, {
            message: mod.Message(getStringKeyForLetter(letter)),
            textSize: 22,
            width: 32,
            textColor: UI.COLORS.BF_BLUE_BRIGHT,
            textAlpha: () => alphaSignalAccessor() * 0.75 + 0.25,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: circleContainer,
            receiver: modTeam,
        });
        return circleContainer;
    }

    private redCapturePoint(
        modTeam: mod.Team,
        parent: UIContainer,
        alphaSignalAccessor: SolidUI.Accessor<number>,
        letter: string
    ): UIContainer {
        const squareContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 32, height: 32 },
            bgFill: mod.UIBgFill.None,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: parent,
            receiver: modTeam,
        });
        // outer square
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 32, height: 32 },
            bgColor: UI.COLORS.BF_RED_BRIGHT,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: () => alphaSignalAccessor() * 0.75,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: squareContainer,
            receiver: modTeam,
        });
        // inner square
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 28, height: 28 },
            bgColor: UI.COLORS.BF_RED_DARK,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: () => alphaSignalAccessor() * 0.75,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: squareContainer,
            receiver: modTeam,
        });
        // letter
        SolidUI.h(UIText, {
            message: mod.Message(letter),
            textSize: 22,
            width: 32,
            textColor: UI.COLORS.BF_RED_BRIGHT,
            textAlpha: () => alphaSignalAccessor() * 0.75 + 0.25,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: squareContainer,
            receiver: modTeam,
        });

        return squareContainer;
    }

    private grayCapturePoint(
        modTeam: mod.Team,
        parent: UIContainer,
        alphaSignalAccessor: SolidUI.Accessor<number>,
        letter: string
    ): UIContainer {
        const squareContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 32, height: 32 },
            bgFill: mod.UIBgFill.None,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: parent,
            receiver: modTeam,
        });
        // outer square
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 32, height: 32 },
            bgColor: UI.COLORS.BF_GREY_1,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: () => alphaSignalAccessor() * 0.75,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: squareContainer,
            receiver: modTeam,
        });
        // inner square
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 28, height: 28 },
            bgColor: UI.COLORS.BF_GREY_4,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: () => alphaSignalAccessor() * 0.75,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: squareContainer,
            receiver: modTeam,
        });
        // letter
        SolidUI.h(UIText, {
            message: mod.Message(getStringKeyForLetter(letter)),
            textSize: 22,
            width: 32,
            textColor: UI.COLORS.BF_GREY_1,
            textAlpha: () => alphaSignalAccessor() * 0.75 + 0.25,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: squareContainer,
            receiver: modTeam,
        });

        return squareContainer;
    }

    public restrictedAreaWarning(
        player: mod.Player,
        isActiveAccessor: SolidUI.Accessor<boolean>,
        timeToRedeployAccessor: SolidUI.Accessor<number>
    ): UIContainer {
        const container = SolidUI.h(UIContainer, {
            position: { x: 0, y: 200 },
            size: { width: 500, height: 200 },
            bgColor: UI.COLORS.BF_GREY_2,
            bgFill: mod.UIBgFill.Blur,
            bgAlpha: 1,
            visible: isActiveAccessor,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopCenter,
        });
        SolidUI.h(UIText, {
            message: () => mod.Message(mod.stringkeys.gameUI.timeToRedeploy, timeToRedeployAccessor()),
            position: { x: 0, y: 34 },
            size: { width: 460, height: 50 },
            textSize: 60,
            visible: isActiveAccessor,
            textColor: UI.COLORS.BF_RED_BRIGHT,
            parent: container,
            anchor: mod.UIAnchor.TopCenter,
            depth: mod.UIDepth.AboveGameUI,
            receiver: player,
        });
        SolidUI.h(UIText, {
            message: mod.Message(mod.stringkeys.gameUI.returnToCombatArea),
            position: { x: 0, y: 120 },
            size: { width: 460, height: 50 },
            textSize: 30,
            visible: isActiveAccessor,
            textColor: UI.COLORS.BF_RED_BRIGHT,
            anchor: mod.UIAnchor.TopCenter,
            parent: container,
            depth: mod.UIDepth.AboveGameUI,
            receiver: player,
        });
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 108 },
            size: { width: 460, height: 2 },
            bgColor: UI.COLORS.BF_RED_BRIGHT,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 1,
            visible: isActiveAccessor,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopCenter,
            parent: container,
            receiver: player,
        });
        SolidUI.h(UIContainer, {
            position: { x: 0, y: 180 },
            size: { width: 460, height: 2 },
            bgColor: UI.COLORS.BF_RED_BRIGHT,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 1,
            visible: isActiveAccessor,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopCenter,
            parent: container,
            receiver: player,
        });

        return container;
    }

    public capturePointProgress(
        player: mod.Player,
        isActiveAccessor: SolidUI.Accessor<boolean>,
        friendlyPlayersCountAccessor: SolidUI.Accessor<number>,
        enemyPlayersCountAccessor: SolidUI.Accessor<number>,
        progressAccessor: SolidUI.Accessor<number>
    ): UIContainer {
        const livesUI = SolidUI.h(UIContainer, {
            position: { x: 400, y: 100 },
            size: { width: 100, height: 100 },
            bgColor: UI.COLORS.GREEN,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 0.5,
            visible: isActiveAccessor,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopCenter,
            receiver: player,
        });
        SolidUI.h(UIText, {
            position: { x: 0, y: -30 },
            anchor: mod.UIAnchor.Center,
            message: () => mod.Message(mod.stringkeys.gameUI.teamScore, friendlyPlayersCountAccessor()),
            textSize: 20,
            width: 80,
            visible: isActiveAccessor,
            textColor: UI.COLORS.WHITE,
            depth: mod.UIDepth.AboveGameUI,
            receiver: player,
            parent: livesUI,
        });
        SolidUI.h(UIText, {
            position: { x: 0, y: 30 },
            anchor: mod.UIAnchor.Center,
            message: () => mod.Message(mod.stringkeys.gameUI.teamScore, enemyPlayersCountAccessor()),
            textSize: 20,
            width: 80,
            visible: isActiveAccessor,
            textColor: UI.COLORS.WHITE,
            depth: mod.UIDepth.AboveGameUI,
            receiver: player,
            parent: livesUI,
        });
        SolidUI.h(UIText, {
            position: { x: 0, y: 60 },
            anchor: mod.UIAnchor.Center,
            message: () => mod.Message(mod.stringkeys.gameUI.teamScore, progressAccessor()),
            textSize: 20,
            width: 80,
            visible: isActiveAccessor,
            textColor: UI.COLORS.WHITE,
            depth: mod.UIDepth.AboveGameUI,
            receiver: player,
            parent: livesUI,
        });
        return livesUI;
    }

    public teamScores(
        modTeam: mod.Team,
        teamScoreAccessor: SolidUI.Accessor<number>,
        opponentScoreAccessor: SolidUI.Accessor<number>
    ): void {
        this.teamScore(modTeam, teamScoreAccessor, {
            x: -233,
            darkColor: UI.COLORS.BF_BLUE_DARK,
            brightColor: UI.COLORS.BF_BLUE_BRIGHT,
        });
        this.teamScore(modTeam, opponentScoreAccessor, {
            x: 233,
            darkColor: UI.COLORS.BF_RED_DARK,
            brightColor: UI.COLORS.BF_RED_BRIGHT,
        });
    }

    private teamScore(team: mod.Team, scoreAccessor: SolidUI.Accessor<number>, props: TeamScoreProps): UIContainer {
        const [alphaSignal, setAlphaSignal] = SolidUI.createSignal(0);

        SolidUI.createEffect(() => {
            scoreAccessor();
            const intervalId = Timers.setInterval(
                () => {
                    setAlphaSignal((prev) => {
                        if (prev < 1) {
                            prev += 0.1;
                        } else {
                            prev = 0;
                            Timers.clearInterval(intervalId);
                        }
                        return prev;
                    });
                },
                50,
                true
            );
        });

        const container = SolidUI.h(UIContainer, {
            x: props.x,
            y: 54,
            size: { width: 84, height: 34 },
            bgColor: props.darkColor,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 0.75,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopCenter,
            receiver: team,
        });

        SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 84, height: 34 },
            bgColor: props.brightColor,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: alphaSignal,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopLeft,
            parent: container,
            receiver: team,
        });

        SolidUI.h(UIText, {
            message: () => mod.Message(mod.stringkeys.gameUI.teamScore, scoreAccessor()),
            textSize: 34,
            width: 84,
            textColor: props.brightColor,
            depth: mod.UIDepth.AboveGameUI,
            parent: container,
            receiver: team,
        });

        return container;
    }

    public teamScoreBars(
        modTeam: mod.Team,
        teamScoreAccessor: SolidUI.Accessor<number>,
        opponentScoreAccessor: SolidUI.Accessor<number>,
        maxScore: number
    ): void {
        const leftContainer = SolidUI.h(UIContainer, {
            position: { x: -94, y: 64 },
            size: { width: 178, height: 12 },
            bgFill: mod.UIBgFill.None,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopCenter,
            receiver: modTeam,
        });
        const rightContainer = SolidUI.h(UIContainer, {
            position: { x: 94, y: 64 },
            size: { width: 178, height: 12 },
            bgFill: mod.UIBgFill.None,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopCenter,
            receiver: modTeam,
        });
        this.teamScoreBar(leftContainer, modTeam, teamScoreAccessor, {
            foregroundColor: UI.COLORS.BF_BLUE_BRIGHT,
            backgroundColor: UI.COLORS.BF_BLUE_DARK,
            progressionType: 'shrinking',
            progressionDirection: 'rightToLeft',
            maxScore,
        });
        this.teamScoreBar(rightContainer, modTeam, opponentScoreAccessor, {
            foregroundColor: UI.COLORS.BF_RED_BRIGHT,
            backgroundColor: UI.COLORS.BF_RED_DARK,
            progressionType: 'shrinking',
            progressionDirection: 'leftToRight',
            maxScore,
        });
    }

    private teamScoreBar(
        parent: UIContainer,
        team: mod.Team,
        scoreAccessor: SolidUI.Accessor<number>,
        props: TeamScoreBarProps
    ): UIContainer {
        const [widthSignal, setWidthSignal] = SolidUI.createSignal(
            props.progressionType === 'shrinking' ? parent.width : 0
        );

        SolidUI.createEffect(() => {
            const ratio = scoreAccessor() / props.maxScore;
            const targetRatio = props.progressionType === 'shrinking' ? 1 - ratio : ratio;
            setWidthSignal(Math.round(targetRatio * parent.width));
        });
        const container = SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: parent.width, height: parent.height },
            bgColor: props.backgroundColor,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 0.75,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopLeft,
            parent: parent,
            receiver: team,
        });

        SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            width: widthSignal,
            height: parent.height,
            bgColor: props.foregroundColor,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 0.75,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor:
                (props.progressionDirection === 'leftToRight') === (props.progressionType === 'growing')
                    ? mod.UIAnchor.TopLeft
                    : mod.UIAnchor.TopRight,
            parent: container,
            receiver: team,
        });

        return container;
    }
}
