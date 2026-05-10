import { UI } from 'bf6-portal-utils/ui';
import { UIContainer } from 'bf6-portal-utils/ui/components/container';
import { UIText } from 'bf6-portal-utils/ui/components/text';
import { SolidUI } from 'bf6-portal-utils/solid-ui';

export function renderRestrictedAreaWarning(
    player: mod.Player,
    isActiveAccessor: SolidUI.Accessor<boolean>,
    timeToRedeployAccessor: SolidUI.Accessor<number>
): void {
    const container = SolidUI.h(UIContainer, {
        position: { x: 0, y: 200 },
        size: { width: 500, height: 200 },
        bgColor: UI.COLORS.BF_GREY_2,
        bgFill: mod.UIBgFill.Blur,
        bgAlpha: 1,
        visible: isActiveAccessor,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.TopCenter,
        receiver: player,
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
}
