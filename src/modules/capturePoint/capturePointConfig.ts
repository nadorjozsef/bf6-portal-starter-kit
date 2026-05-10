import { configOverrides } from '../../configOverrides.ts';

export interface CapturePointConfig {
    captureTime: number;
    neutralizationTime: number;
    maxCaptureMultiplier: number;
}

const defaultConfig: CapturePointConfig = {
    captureTime: 5,
    neutralizationTime: 5,
    maxCaptureMultiplier: 2,
};

export const capturePointConfig: CapturePointConfig = {
    captureTime: configOverrides.capturePoint?.captureTime ?? defaultConfig.captureTime,
    neutralizationTime: configOverrides.capturePoint?.neutralizationTime ?? defaultConfig.neutralizationTime,
    maxCaptureMultiplier: configOverrides.capturePoint?.maxCaptureMultiplier ?? defaultConfig.maxCaptureMultiplier,
};
