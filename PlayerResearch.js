"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerResearch = void 0;
const AdvanceRegistry_1 = require("./AdvanceRegistry");
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Complete_1 = require("./Rules/Complete");
const Cost_1 = require("./Rules/Cost");
const Requirements_1 = require("./Rules/Requirements");
const Yields_1 = require("./Yields");
const Started_1 = require("./Rules/Started");
class PlayerResearch extends DataObject_1.DataObject {
    constructor(player, advanceRegistry = AdvanceRegistry_1.instance, rulesRegistry = RuleRegistry_1.instance) {
        super();
        this._complete = [];
        this._researching = null;
        this._cost = new Yields_1.Research(Infinity);
        this._progress = new Yields_1.Research(0);
        this._advanceRegistry = advanceRegistry;
        this._player = player;
        this._rulesRegistry = rulesRegistry;
        this.addKey('available', 'complete', 'cost', 'progress', 'researching');
    }
    add(researchYield) {
        this._progress.add(researchYield);
        this.check();
    }
    addAdvance(CompleteAdvance) {
        if (this._complete.some((advance) => advance instanceof CompleteAdvance)) {
            return;
        }
        if (this._researching === CompleteAdvance) {
            this._researching = null;
        }
        const completedResearch = new CompleteAdvance();
        this._complete.push(completedResearch);
        this._rulesRegistry.process(Complete_1.default, this, completedResearch);
    }
    available() {
        const rules = this._rulesRegistry.get(Requirements_1.default);
        return this._advanceRegistry.filter((AvailableAdvance) => rules
            .filter((rule) => rule.validate(AvailableAdvance, this._complete))
            .every((rule) => rule.process(AvailableAdvance, this._complete) === true) &&
            !this._complete.some((advance) => advance instanceof AvailableAdvance));
    }
    check() {
        if (this._researching !== null &&
            this._progress.value() >= this._cost.value()) {
            const completedResearch = new this._researching();
            this._complete.push(completedResearch);
            this._researching = null;
            this._progress.subtract(this._cost);
            this._cost.set(Infinity);
            this._rulesRegistry.process(Complete_1.default, this, completedResearch);
        }
    }
    complete() {
        return this._complete;
    }
    completed(CompleteAdvance) {
        return this._complete.some((advance) => advance instanceof CompleteAdvance);
    }
    cost() {
        return this._cost;
    }
    player() {
        return this._player;
    }
    progress() {
        return this._progress;
    }
    research(AdvanceToResearch) {
        const [cost] = this._rulesRegistry.process(Cost_1.default, AdvanceToResearch, this);
        this._cost.set(cost);
        this._researching = AdvanceToResearch;
        this._rulesRegistry.process(Started_1.default, this, AdvanceToResearch);
    }
    researching() {
        return this._researching;
    }
}
exports.PlayerResearch = PlayerResearch;
exports.default = PlayerResearch;
//# sourceMappingURL=PlayerResearch.js.map