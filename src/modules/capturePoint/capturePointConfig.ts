export interface CapturePointConfig {
    captureTime: number;
    neutralizationTime: number;
    maxCaptureMultiplier: number;
}

export const capturePointConfig: CapturePointConfig = {
    captureTime: 5,
    neutralizationTime: 5,
    maxCaptureMultiplier: 2,
};

export function setCapturePointOverrides(overrides: Partial<CapturePointConfig>): void {
    Object.assign(capturePointConfig, overrides);
}
