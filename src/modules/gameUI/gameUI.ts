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
    x: number;
    darkColor: mod.Vector;
    brightColor: mod.Vector;
    anchor: mod.UIAnchor;
    maxScore: number;
}

interface CapturePointData {
    ownerTeamIdAccessor: SolidUI.Accessor<number>;
    isCapturingAccessor: SolidUI.Accessor<boolean>;
}

export class GameUI {
    private static _instance: GameUI | undefined;

    private constructor() { }

    static getInstance(): GameUI {
        if (!GameUI._instance) {
            GameUI._instance = new GameUI();
        }
        return GameUI._instance;
    }

    public bigBlueCapturePoint(
        player: mod.Player,
        isActiveAccessor: SolidUI.Accessor<boolean>,
        friendlyPlayersCountAccessor: SolidUI.Accessor<number>,
        enemyPlayersCountAccessor: SolidUI.Accessor<number>,
        progressAccessor: SolidUI.Accessor<number>): UIContainer {
        const letterStringKey = mod.stringkeys.gameUI.capturePointA;

        const mainContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 170 },
            size: { width: 60, height: 60 },
            bgFill: mod.UIBgFill.None,
            visible: isActiveAccessor,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopCenter,
            receiver: player,
        });
        const playersContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 50 },
            size: { width: 90, height: 6 },
            bgFill: mod.UIBgFill.Solid,
            visible: isActiveAccessor,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: mainContainer,
            receiver: player,
        });
        const friendlyPlayersContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 90, height: 6 },
            bgFill: mod.UIBgFill.Solid,
            bgColor: UI.COLORS.BF_BLUE_BRIGHT,
            visible: () => isActiveAccessor() && (progressAccessor() < 1 || enemyPlayersCountAccessor() > 0),
            bgAlpha: 1,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.CenterLeft,
            parent: playersContainer,
            receiver: player,
        });
        const percentage = (enemyPlayersCountAccessor() / (friendlyPlayersCountAccessor() + enemyPlayersCountAccessor())).toFixed(0);
        const width = 90 * Number(percentage);
        const enemyPlayersContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width, height: 6 },
            bgFill: mod.UIBgFill.Solid,
            bgColor: UI.COLORS.BF_RED_BRIGHT,
            visible: () => isActiveAccessor() && (progressAccessor() < 1 || enemyPlayersCountAccessor() > 0),
            bgAlpha: 1,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.CenterRight,
            parent: playersContainer,
            receiver: player,
        });
        const friendlyPlayersText = SolidUI.h(UIText, {
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
            receiver: player,
        });
        const enemyPlayersText = SolidUI.h(UIText, {
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
            receiver: player,
        });

        const circleContainer = SolidUI.h(UIContainer, {
            position: { x: 0, y: 0 },
            size: { width: 60, height: 60 },
            bgFill: mod.UIBgFill.None,
            visible: isActiveAccessor,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: mainContainer,
            receiver: player,
        });
        // outer circle
        SolidUI.h(UIText, {
            message: mod.Message(mod.stringkeys.gameUI.circle),
            textSize: 60,
            width: 60,
            visible: isActiveAccessor,
            textColor: UI.COLORS.BF_BLUE_BRIGHT,
            textAlpha: 0.75,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: circleContainer,
            receiver: player,
        });
        // inner circle
        SolidUI.h(UIText, {
            message: mod.Message(mod.stringkeys.gameUI.circle),
            textSize: 54,
            width: 54,
            visible: isActiveAccessor,
            textColor: UI.COLORS.BF_BLUE_DARK,
            textAlpha: 0.75,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: circleContainer,
            receiver: player,
        });
        // letter
        SolidUI.h(UIText, {
            message: mod.Message(letterStringKey),
            textSize: 36,
            width: 44,
            visible: isActiveAccessor,
            textColor: UI.COLORS.BF_BLUE_BRIGHT,
            textAlpha: 1,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.Center,
            parent: circleContainer,
            receiver: player,
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
        const letters = [
            mod.stringkeys.gameUI.capturePointA,
            mod.stringkeys.gameUI.capturePointB,
            mod.stringkeys.gameUI.capturePointC,
            mod.stringkeys.gameUI.capturePointD,
            mod.stringkeys.gameUI.capturePointE,
            mod.stringkeys.gameUI.capturePointF,
            mod.stringkeys.gameUI.capturePointG,
        ];
        for (let i = 0; i < numberOfCapturePoints; i++) {
            this.capturePoint(
                modTeam,
                capturePoints[i].ownerTeamIdAccessor,
                capturePoints[i].isCapturingAccessor,
                letters[i],
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
        letterStringKey: string
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
            message: mod.Message(letterStringKey),
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
            message: mod.Message(letter),
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

    public restrictedAreaWarning(player: mod.Player, isActiveAccessor: SolidUI.Accessor<boolean>, timeToRedeployAccessor: SolidUI.Accessor<number>): UIContainer {
        const container = SolidUI.h(UIContainer, {
            position: { x: 0, y: 200 },
            size: { width: 500, height: 200 },
            bgColor: UI.COLORS.BF_GREY_2,
            bgFill: mod.UIBgFill.Blur,
            bgAlpha: 1,
            visible: isActiveAccessor,
            depth: mod.UIDepth.AboveGameUI,
            anchor: mod.UIAnchor.TopCenter
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
        progressAccessor: SolidUI.Accessor<number>): UIContainer {
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
        this.teamScoreBar(modTeam, teamScoreAccessor, {
            x: -94,
            darkColor: UI.COLORS.BF_BLUE_DARK,
            brightColor: UI.COLORS.BF_BLUE_BRIGHT,
            anchor: mod.UIAnchor.TopLeft,
            maxScore,
        });
        this.teamScoreBar(modTeam, opponentScoreAccessor, {
            x: 94,
            darkColor: UI.COLORS.BF_RED_DARK,
            brightColor: UI.COLORS.BF_RED_BRIGHT,
            anchor: mod.UIAnchor.TopRight,
            maxScore,
        });
    }

    private teamScoreBar(
        team: mod.Team,
        scoreAccessor: SolidUI.Accessor<number>,
        props: TeamScoreBarProps
    ): UIContainer {
        const CONTAINER_WIDTH = 178;
        const [widthSignal, setWidthSignal] = SolidUI.createSignal(0);

        SolidUI.createEffect(() => {
            const teamScorePercentige = (scoreAccessor() / props.maxScore) * 100;
            setWidthSignal(+((teamScorePercentige / 100) * CONTAINER_WIDTH).toFixed(0));
        });

        const container = SolidUI.h(UIContainer, {
            x: props.x,
            y: 64,
            size: { width: CONTAINER_WIDTH, height: 12 },
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
            width: widthSignal,
            height: 12,
            bgColor: props.brightColor,
            bgFill: mod.UIBgFill.Solid,
            bgAlpha: 0.75,
            visible: true,
            depth: mod.UIDepth.AboveGameUI,
            anchor: props.anchor,
            parent: container,
            receiver: team,
        });

        return container;
    }
}
