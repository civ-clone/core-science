"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.PlayerResearchRegistry = void 0;
const EntityRegistry_1 = require("@civ-clone/core-registry/EntityRegistry");
const PlayerResearch_1 = require("./PlayerResearch");
class PlayerResearchRegistry extends EntityRegistry_1.EntityRegistry {
    constructor() {
        super(PlayerResearch_1.default);
    }
    getByPlayer(player) {
        const playerResearch = this.getBy('player', player);
        if (playerResearch.length !== 1) {
            throw new TypeError('Wrong number of results for player.');
        }
        return playerResearch[0];
    }
}
exports.PlayerResearchRegistry = PlayerResearchRegistry;
exports.instance = new PlayerResearchRegistry();
exports.default = PlayerResearchRegistry;
//# sourceMappingURL=PlayerResearchRegistry.js.map