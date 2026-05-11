// =============================================
//  Demo: Restricted Area Warning UI
//  Edit this file with your own UI code to preview
// =============================================

import {
    initViewport,
    setStrings,
    setBackgroundImage,
    mod,
    UI,
    SolidUI,
    UIContainer,
    UIText,
    UIButton,
    UITextButton,
    UIImage,
} from './bf6-ui-renderer.js';

// ---- Load your string keys ----
setStrings({
    gameUI: {
        timeToRedeploy: '{}',
        returnToCombatArea: 'RETURN TO COMBAT AREA',
    },
});

// ---- Initialize the viewport ----
initViewport();

// Optional: overlay on a gameplay screenshot
// setBackgroundImage('screenshot.jpg');

// ---- Mock player (ignored by the renderer) ----
const player = {};

// ---- Your UI code below ----
// Paste your SolidUI / UIContainer / UIText code here.
// Remove TypeScript type annotations.
// The API surface matches bf6-portal-utils.

const container = SolidUI.h(UIContainer, {
    position: { x: 0, y: 200 },
    size: { width: 500, height: 200 },
    bgColor: UI.COLORS.BF_GREY_2,
    bgFill: mod.UIBgFill.Blur,
    bgAlpha: 1,
    visible: true,
    depth: mod.UIDepth.AboveGameUI,
    anchor: mod.UIAnchor.TopCenter,
    receiver: player,
});

const container2 = SolidUI.h(UIContainer, {
    position: { x: 0, y: 600 },
    size: { width: 500, height: 200 },
    bgColor: UI.COLORS.BF_GREY_2,
    bgFill: mod.UIBgFill.Blur,
    bgAlpha: 1,
    visible: true,
    depth: mod.UIDepth.AboveGameUI,
    anchor: mod.UIAnchor.TopCenter,
    receiver: player,
});

SolidUI.h(UIText, {
    message: () => mod.Message(mod.stringkeys.gameUI.timeToRedeploy, 0),
    position: { x: 30, y: 30 },
    size: { width: 0, height: 0 },
    textSize: 20,
    visible: true,
    textColor: UI.COLORS.BF_RED_BRIGHT,
    parent: container2,
    anchor: mod.UIAnchor.TopLeft,
    depth: mod.UIDepth.AboveGameUI,
    receiver: player,
});

SolidUI.h(UIText, {
    message: () => mod.Message(mod.stringkeys.gameUI.timeToRedeploy, 1),
    position: { x: 30, y: 30 },
    size: { width: 0, height: 0 },
    textSize: 60,
    visible: true,
    textColor: UI.COLORS.BF_RED_BRIGHT,
    parent: container2,
    anchor: mod.UIAnchor.TopRight,
    depth: mod.UIDepth.AboveGameUI,
    receiver: player,
});

SolidUI.h(UIText, {
    message: () => mod.Message(mod.stringkeys.gameUI.timeToRedeploy, 2),
    position: { x: 30, y: 30 },
    size: { width: 0, height: 0 },
    textSize: 60,
    visible: true,
    textColor: UI.COLORS.BF_RED_BRIGHT,
    parent: container2,
    anchor: mod.UIAnchor.BottomRight,
    depth: mod.UIDepth.AboveGameUI,
    receiver: player,
});

SolidUI.h(UIText, {
    message: () => mod.Message(mod.stringkeys.gameUI.timeToRedeploy, 3),
    position: { x: 30, y: 30 },
    size: { width: 0, height: 0 },
    textSize: 60,
    visible: true,
    textColor: UI.COLORS.BF_RED_BRIGHT,
    parent: container2,
    anchor: mod.UIAnchor.BottomLeft,
    depth: mod.UIDepth.AboveGameUI,
    receiver: player,
});

SolidUI.h(UIContainer, {
    position: { x: 0, y: 0 },
    size: { width: 150, height: 150 },
    bgColor: UI.COLORS.BF_YELLOW_BRIGHT,
    bgFill: mod.UIBgFill.Blur,
    bgAlpha: 1,
    visible: true,
    depth: mod.UIDepth.AboveGameUI,
    anchor: mod.UIAnchor.Center,
    parent: container2,
    receiver: player,
});

SolidUI.h(UIText, {
    message: () => mod.Message(mod.stringkeys.gameUI.timeToRedeploy, 0),
    position: { x: 0, y: 30 },
    size: { width: 460, height: 50 },
    textSize: 60,
    visible: true,
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
    visible: true,
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
    visible: true,
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
    visible: true,
    depth: mod.UIDepth.AboveGameUI,
    anchor: mod.UIAnchor.TopCenter,
    parent: container,
    receiver: player,
});

SolidUI.h(UIContainer, {
        position: { x: 300, y: 180 },
        size: { width: 2, height: 50 },
        bgColor: UI.COLORS.GREEN,
        bgFill: mod.UIBgFill.Solid,
        bgAlpha: 1,
        visible: true,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.CenterRight,
        parent: container,
        receiver: player,
    });

    SolidUI.h(UIContainer, {
        position: { x: 330, y: 180 },
        size: { width: 2, height: 50 },
        bgColor: UI.COLORS.CYAN,
        bgFill: mod.UIBgFill.Solid,
        bgAlpha: 1,
        visible: true,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.BottomRight,
        parent: container,
        receiver: player,
    });

    SolidUI.h(UIContainer, {
        position: { x: 300, y: 180 },
        size: { width: 50, height: 2 },
        bgColor: UI.COLORS.YELLOW,
        bgFill: mod.UIBgFill.Solid,
        bgAlpha: 1,
        visible: true,
        depth: mod.UIDepth.AboveGameUI,
        anchor: mod.UIAnchor.BottomCenter,
        parent: container,
        receiver: player,
    });
