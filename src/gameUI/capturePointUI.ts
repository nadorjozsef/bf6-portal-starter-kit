import { UI } from 'bf6-portal-utils/ui';
import { UIContainer } from 'bf6-portal-utils/ui/components/container';
import { UIText } from 'bf6-portal-utils/ui/components/text';
import { SolidUI } from 'bf6-portal-utils/solid-ui';
import { Timers } from 'bf6-portal-utils/timers';

export function flagCaptureProgress(
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
    playerProgressBars(
        mainContainer,
        player,
        isActiveAccessor,
        progressAccessor,
        enemyPlayersCountAccessor,
        friendlyPlayersCountAccessor
    );
    bigBlueCircleCapturePoint(
        mainContainer,
        player,
        isActiveAccessor,
        letterAccessor,
        progressAccessor,
        currentOwnerTeamIdAccessor,
        enemyPlayersCountAccessor
    );
    bigBlueSquareCapturePoint(
        mainContainer,
        player,
        isActiveAccessor,
        letterAccessor,
        progressAccessor,
        currentOwnerTeamIdAccessor
    );
    bigRedSquareCapturePoint(
        mainContainer,
        player,
        isActiveAccessor,
        letterAccessor,
        progressAccessor,
        currentOwnerTeamIdAccessor
    );
}

export function capturePoints(modTeam: mod.Team, capturePoints: CapturePointData[]): void {
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
        capturePoint(
            modTeam,
            capturePoints[i].ownerTeamIdAccessor,
            capturePoints[i].isCapturingAccessor,
            capturePoints[i].letter,
            capturePointXPositions[i]
        );
    }
}

export function capturePointProgress(
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

interface CapturePointData {
    letter: string;
    ownerTeamIdAccessor: SolidUI.Accessor<number>;
    isCapturingAccessor: SolidUI.Accessor<boolean>;
}

function playerProgressBars(
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
        width: 90 * (enemyPlayersCountAccessor() / (friendlyPlayersCountAccessor() + enemyPlayersCountAccessor()) || 0),
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

function bigBlueCircleCapturePoint(
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

function bigBlueSquareCapturePoint(
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

function bigRedSquareCapturePoint(
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

function capturePoint(
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

    const blueCapturePointContainer = blueCapturePoint(modTeam, mainContainer, alphaSignal, letter);
    const grayCapturePointContainer = grayCapturePoint(modTeam, mainContainer, alphaSignal, letter);
    const redCapturePointContainer = redCapturePoint(modTeam, mainContainer, alphaSignal, letter);

    SolidUI.createEffect(() => {
        if (ownerTeamIdAccessor() === 0) {
            blueCapturePointContainer.hide();
            redCapturePointContainer.hide();
            grayCapturePointContainer.show();
        } else if (ownerTeamIdAccessor() === 1) {
            if (mod.GetObjId(modTeam) === 1) {
                blueCapturePointContainer.show();
                redCapturePointContainer.hide();
            } else if (mod.GetObjId(modTeam) === 2) {
                blueCapturePointContainer.hide();
                redCapturePointContainer.show();
            }
            grayCapturePointContainer.hide();
        } else if (ownerTeamIdAccessor() === 2) {
            if (mod.GetObjId(modTeam) === 1) {
                blueCapturePointContainer.hide();
                redCapturePointContainer.show();
            } else if (mod.GetObjId(modTeam) === 2) {
                blueCapturePointContainer.show();
                redCapturePointContainer.hide();
            }
            grayCapturePointContainer.hide();
        }
    });
}

function blueCapturePoint(
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

function redCapturePoint(
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

function grayCapturePoint(
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
