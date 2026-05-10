export interface CapturePointConfig {
    captureTime: number;
    neutralizationTime: number;
    maxCaptureMultiplier: number;
}

export const capturePointConfig: CapturePointConfig = {
    captureTime: 15,
    neutralizationTime: 20,
    maxCaptureMultiplier: 3,
};

export function setCapturePointOverrides(overrides: Partial<CapturePointConfig>): void {
    Object.assign(capturePointConfig, overrides);
}
