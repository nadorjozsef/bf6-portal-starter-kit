import { Events } from 'bf6-portal-utils/events/index.ts';
import { debug } from '../../debugTool/adminDebugTool.ts';
import { config } from '../../config.ts';

export class HQManager {
    private static _instance: HQManager | undefined;

    private constructor() {
        Events.OnPlayerEnterAreaTrigger.subscribe(this.handlePlayerEnterArea.bind(this));
        Events.OnPlayerExitAreaTrigger.subscribe(this.handlePlayerExitArea.bind(this));
    }

    static getInstance(): HQManager {
        if (!HQManager._instance) {
            HQManager._instance = new HQManager();
        }
        return HQManager._instance;
    }

    private handlePlayerEnterArea(modPlayer: mod.Player, modAreaTrigger: mod.AreaTrigger): void {
        if (!this.isEnemyHQ(modPlayer, modAreaTrigger)) {
            return;
        }

        debug?.dynamicLog(`${mod.GetObjId(modPlayer)} player entered enemy HQ area ${mod.GetObjId(modAreaTrigger)} `);
    }

    private handlePlayerExitArea(modPlayer: mod.Player, modAreaTrigger: mod.AreaTrigger): void {
        if (!this.isEnemyHQ(modPlayer, modAreaTrigger)) {
            return;
        }
        debug?.dynamicLog(`${mod.GetObjId(modPlayer)} player exited enemy HQ area ${mod.GetObjId(modAreaTrigger)} `);
    }

    private isEnemyHQ(modPlayer: mod.Player, modAreaTrigger: mod.AreaTrigger): boolean {
        const playerTeamId = mod.GetObjId(mod.GetTeam(modPlayer));
        const areaTriggerId = mod.GetObjId(modAreaTrigger);
        debug?.dynamicLog(`area trigger id: ${areaTriggerId} player team id:${playerTeamId}`);
        return config.teamHQMapping.some(mapping => mapping.hqId === areaTriggerId && mapping.teamId !== playerTeamId);
    }
}
