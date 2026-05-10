import { UI } from 'bf6-portal-utils/ui';
import { UIContainer } from 'bf6-portal-utils/ui/components/container';
import { UIText } from 'bf6-portal-utils/ui/components/text';
import { UIImage } from 'bf6-portal-utils/ui/components/image';
import { SolidUI } from 'bf6-portal-utils/solid-ui';
import { Timers } from 'bf6-portal-utils/timers';

interface TeamScoreProps {
    backgroundColor: mod.Vector;
    foregroundColor: mod.Vector;
}

interface TeamScoreBarProps {
    backgroundColor: mod.Vector;
    foregroundColor: mod.Vector;
    progressionDirection: 'leftToRight' | 'rightToLeft';
    maxScore: number;
}

export function renderTeamScores(
    modTeam: mod.Team,
    teamScoreAccessor: SolidUI.Accessor<number>,
    opponentScoreAccessor: SolidUI.Accessor<number>
): void {
    const leftContainer = SolidUI.h(UIContainer, {
        position: { x: -233, y: 54 },
        size: { width: 84, height: 34 },
        bgFill: mod.UIBgFill.None,
        visible: true,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.TopCenter,
        receiver: modTeam,
    });
    const rightContainer = SolidUI.h(UIContainer, {
        position: { x: 233, y: 54 },
        size: { width: 84, height: 34 },
        bgFill: mod.UIBgFill.None,
        visible: true,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.TopCenter,
        receiver: modTeam,
    });
    teamScore(leftContainer, modTeam, teamScoreAccessor, {
        backgroundColor: UI.COLORS.BF_BLUE_DARK,
        foregroundColor: UI.COLORS.BF_BLUE_BRIGHT,
    });
    teamScore(rightContainer, modTeam, opponentScoreAccessor, {
        backgroundColor: UI.COLORS.BF_RED_DARK,
        foregroundColor: UI.COLORS.BF_RED_BRIGHT,
    });
}

export function renderTeamProgressionBars(
    modTeam: mod.Team,
    teamScoreAccessor: SolidUI.Accessor<number>,
    opponentScoreAccessor: SolidUI.Accessor<number>,
    initialScore: number
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
    teamScoreBar(leftContainer, modTeam, teamScoreAccessor, {
        foregroundColor: UI.COLORS.BF_BLUE_BRIGHT,
        backgroundColor: UI.COLORS.BF_BLUE_DARK,
        progressionDirection: 'leftToRight',
        maxScore: initialScore,
    });
    teamScoreBar(rightContainer, modTeam, opponentScoreAccessor, {
        foregroundColor: UI.COLORS.BF_RED_BRIGHT,
        backgroundColor: UI.COLORS.BF_RED_DARK,
        progressionDirection: 'rightToLeft',
        maxScore: initialScore,
    });
}

export function renderTeamProgressionBarsWithTargetScore(
    modTeam: mod.Team,
    teamScoreAccessor: SolidUI.Accessor<number>,
    opponentScoreAccessor: SolidUI.Accessor<number>,
    targetScore: number
): void {
    const leftContainer = SolidUI.h(UIContainer, {
        position: { x: -114, y: 64 },
        size: { width: 138, height: 12 },
        bgFill: mod.UIBgFill.None,
        visible: true,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.TopCenter,
        receiver: modTeam,
    });
    const rightContainer = SolidUI.h(UIContainer, {
        position: { x: 114, y: 64 },
        size: { width: 138, height: 12 },
        bgFill: mod.UIBgFill.None,
        visible: true,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.TopCenter,
        receiver: modTeam,
    });
    teamScoreBar(leftContainer, modTeam, teamScoreAccessor, {
        foregroundColor: UI.COLORS.BF_BLUE_BRIGHT,
        backgroundColor: UI.COLORS.BF_BLUE_DARK,
        progressionDirection: 'leftToRight',
        maxScore: targetScore,
    });
    teamScoreBar(rightContainer, modTeam, opponentScoreAccessor, {
        foregroundColor: UI.COLORS.BF_RED_BRIGHT,
        backgroundColor: UI.COLORS.BF_RED_DARK,
        progressionDirection: 'rightToLeft',
        maxScore: targetScore,
    });

    const mainContainer = SolidUI.h(UIContainer, {
        position: { x: 0, y: 54 },
        size: { width: 64, height: 30 },
        bgFill: mod.UIBgFill.Solid,
        bgColor: UI.COLORS.BF_GREY_4,
        visible: true,
        bgAlpha: 0.75,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.TopCenter,
        receiver: modTeam,
    });

    SolidUI.h(UIText, {
        position: { x: 0, y: 0 },
        size: { width: mainContainer.width, height: mainContainer.height },
        message: () => mod.Message(mod.stringkeys.gameUI.targetScore, targetScore),
        textSize: 28,
        textColor: UI.COLORS.BF_GREY_1,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.Center,
        parent: mainContainer,
        receiver: modTeam,
    });

    SolidUI.h(UIImage, {
        position: { x: 0, y: -15 },
        size: { width: 25, height: 25 },
        imageType: mod.UIImageType.CrownSolid,
        imageColor: UI.COLORS.BF_GREY_1,
        imageAlpha: 0.75,
        visible: true,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.TopCenter,
        parent: mainContainer,
        receiver: modTeam,
    });
}

function teamScore(
    parent: UIContainer,
    modTeam: mod.Team,
    scoreAccessor: SolidUI.Accessor<number>,
    props: TeamScoreProps
): UIContainer {
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
        position: { x: 0, y: 0 },
        size: { width: parent.width, height: parent.height },
        bgColor: props.backgroundColor,
        bgFill: mod.UIBgFill.Solid,
        bgAlpha: 0.75,
        visible: true,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.TopLeft,
        parent,
        receiver: modTeam,
    });

    SolidUI.h(UIContainer, {
        position: { x: 0, y: 0 },
        size: { width: parent.width, height: parent.height },
        bgColor: props.foregroundColor,
        bgFill: mod.UIBgFill.Solid,
        bgAlpha: alphaSignal,
        visible: true,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.TopLeft,
        parent: container,
        receiver: modTeam,
    });

    SolidUI.h(UIText, {
        position: { x: 0, y: 0 },
        size: { width: parent.width, height: parent.height },
        message: () => mod.Message(mod.stringkeys.gameUI.teamScore, scoreAccessor()),
        textSize: 34,
        textColor: props.foregroundColor,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.Center,
        parent: container,
        receiver: modTeam,
    });

    return container;
}

function teamScoreBar(
    parent: UIContainer,
    modTeam: mod.Team,
    scoreAccessor: SolidUI.Accessor<number>,
    props: TeamScoreBarProps
): UIContainer {
    const [widthSignal, setWidthSignal] = SolidUI.createSignal(0);

    SolidUI.createEffect(() => {
        const ratio = scoreAccessor() / props.maxScore;
        setWidthSignal(Math.round(ratio * parent.width));
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
        receiver: modTeam,
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
        anchor: props.progressionDirection === 'leftToRight' ? mod.UIAnchor.TopLeft : mod.UIAnchor.TopRight,
        parent: container,
        receiver: modTeam,
    });

    return container;
}
