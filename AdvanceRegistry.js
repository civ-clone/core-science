"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instance = exports.AdvanceRegistry = void 0;
const Advance_1 = require("./Advance");
const ConstructorRegistry_1 = require("@civ-clone/core-registry/ConstructorRegistry");
class AdvanceRegistry extends ConstructorRegistry_1.ConstructorRegistry {
    constructor() {
        super(Advance_1.default);
    }
}
exports.AdvanceRegistry = AdvanceRegistry;
exports.instance = new AdvanceRegistry();
exports.default = AdvanceRegistry;
//# sourceMappingURL=AdvanceRegistry.js.map