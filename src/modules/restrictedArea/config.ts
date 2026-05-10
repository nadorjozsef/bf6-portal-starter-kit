export interface RestrictedAreaConfig {
    redeployTime: number;
    objects: RestrictedArea[];
}

interface RestrictedArea {
    id: number;
    ownerTeamId?: number;
}

export let restrictedAreaConfig: RestrictedAreaConfig = {
    redeployTime: 10,
    objects: [
        { id: 301, ownerTeamId: 1 },
        { id: 302, ownerTeamId: 2 },
    ],
};

export function setRestrictedAreaOverrides(overrides: Partial<RestrictedAreaConfig>): void {
    Object.assign(restrictedAreaConfig, overrides);
}
