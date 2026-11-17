"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.advanceCount = void 0;
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const AdvanceCount_1 = require("./Rules/AdvanceCount");
/**
 * How many advances `playerResearch` is counted as knowing: the first of the `AdvanceCount` rules' answers, or, with
 *  none, every advance it knows.
 */
const advanceCount = (playerResearch, ruleRegistry = RuleRegistry_1.instance) => {
    const [count] = ruleRegistry.process(AdvanceCount_1.default, playerResearch);
    return count !== null && count !== void 0 ? count : playerResearch.complete().length;
};
exports.advanceCount = advanceCount;
exports.default = exports.advanceCount;
//# sourceMappingURL=advanceCount.js.map