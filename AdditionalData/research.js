"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdditionalData = void 0;
const PlayerResearchRegistry_1 = require("../PlayerResearchRegistry");
const AdditionalData_1 = require("@civ-clone/core-data-object/AdditionalData");
const Player_1 = require("@civ-clone/core-player/Player");
const getAdditionalData = (playerResearchRegistry = PlayerResearchRegistry_1.instance) => [
    new AdditionalData_1.default(Player_1.default, 'research', (player) => playerResearchRegistry.getByPlayer(player)),
];
exports.getAdditionalData = getAdditionalData;
exports.default = exports.getAdditionalData;
//# sourceMappingURL=research.js.map