import { configOverrides } from '../../configOverrides.ts';

export interface TeamsConfig {
    objects: Team[];
}

interface Team {
    teamId: number;
}

const defaultConfig: TeamsConfig = {
    objects: [{ teamId: 1 }, { teamId: 2 }],
};

export const teamConfig: TeamsConfig = {
    objects: configOverrides.team?.objects ?? defaultConfig.objects,
};
