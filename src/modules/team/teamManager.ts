import { Events } from 'bf6-portal-utils/events';
import { Team } from './team';
import { teamConfig } from './config';

type TeamsInitializedCallback = () => void;

export class TeamManager {
    private static _instance: TeamManager | undefined;
    private _teams: Team[] = [];
    private _teamsInitializedCallbacks: TeamsInitializedCallback[] = [];

    private constructor() {
        Events.OnGameModeStarted.subscribe(this.handleGameModeStarted.bind(this));
    }

    static getInstance(): TeamManager {
        if (!TeamManager._instance) {
            TeamManager._instance = new TeamManager();
        }
        return TeamManager._instance;
    }

    public getTeam(modTeam: mod.Team): Team;
    public getTeam(teamId: number): Team;

    public getTeam(team: number | mod.Team): Team {
        let teamId: number;
        if (typeof team === 'number') {
            teamId = team;
        } else {
            teamId = mod.GetObjId(team);
        }
        return this._teams[teamId - 1];
    }

    public subscribeTeamsInitialized(callback: TeamsInitializedCallback): void {
        this._teamsInitializedCallbacks.push(callback);
    }

    private handleGameModeStarted(): void {
        for (const config of teamConfig.objects ?? []) {
            this._teams.push(new Team(mod.GetTeam(config.teamId)));
        }
        for (const callback of this._teamsInitializedCallbacks) {
            callback();
        }
    }
}
