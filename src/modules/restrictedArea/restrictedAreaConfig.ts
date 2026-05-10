import { configOverrides } from '../../configOverrides.ts';

export interface RestrictedAreaConfig {
    redeployTime: number;
    objects: RestrictedArea[];
}

interface RestrictedArea {
    id: number;
    ownerTeamId?: number;
}

const defaultConfig: RestrictedAreaConfig = {
    redeployTime: 10,
    objects: [
        { id: 301, ownerTeamId: 1 },
        { id: 302, ownerTeamId: 2 },
    ],
};

export const restrictedAreaConfig: RestrictedAreaConfig = {
    redeployTime: configOverrides.restrictedArea?.redeployTime ?? defaultConfig.redeployTime,
    objects: configOverrides.restrictedArea?.objects ?? defaultConfig.objects,
};
