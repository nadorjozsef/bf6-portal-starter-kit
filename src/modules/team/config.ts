export interface TeamsConfig {
    objects: Team[];
}

interface Team {
    teamId: number;
}

export const teamConfig: TeamsConfig = {
    objects: [{ teamId: 1 }, { teamId: 2 }],
};

export function setTeamOverrides(overrides: Partial<TeamsConfig>): void {
    Object.assign(teamConfig, overrides);
}
