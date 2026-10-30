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
        this._cleared = null;
        this._complete = [];
        this._researching = null;
        this._cost = new Yields_1.Research(Infinity);
        this._progress = new Yields_1.Research(0);
        this._advanceRegistry = advanceRegistry;
        this._player = player;
        this._rulesRegistry = rulesRegistry;
        this.addKey('available', 'cleared', 'complete', 'cost', 'progress', 'researching');
    }
    add(researchYield) {
        this._progress.add(researchYield);
        this.check();
    }
    addAdvance(CompleteAdvance) {
        if (!CompleteAdvance.repeatable &&
            this._complete.some((advance) => advance instanceof CompleteAdvance)) {
            return;
        }
        if (this._researching === CompleteAdvance) {
            this._researching = null;
            this._cleared = {
                reason: 'acquired',
                advance: CompleteAdvance,
            };
        }
        else if (this._researching === null) {
            // Researching nothing, the last reason is no longer the latest news (civ-clone/web-renderer#726).
            this._cleared = null;
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
            (AvailableAdvance.repeatable ||
                !this._complete.some((advance) => advance instanceof AvailableAdvance)));
    }
    check() {
        if (this._researching !== null &&
            this._progress.value() >= this._cost.value()) {
            const completedResearch = new this._researching();
            this._complete.push(completedResearch);
            this._cleared = {
                reason: 'completed',
                advance: this._researching,
            };
            this._researching = null;
            this._progress.subtract(this._cost);
            this._cost.set(Infinity);
            this._rulesRegistry.process(Complete_1.default, this, completedResearch);
        }
    }
    /**
     * Why the player is researching nothing, or `null` while they research something, or when that isn't known (a new
     *  game, or an older save).
     */
    cleared() {
        var _a;
        if (this._researching !== null) {
            return null;
        }
        // A player's research restored from a save made before this existed has no `_cleared` at all.
        return (_a = this._cleared) !== null && _a !== void 0 ? _a : null;
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
        this._cleared = null;
        this._rulesRegistry.process(Started_1.default, this, AdvanceToResearch);
    }
    researching() {
        return this._researching;
    }
}
exports.PlayerResearch = PlayerResearch;
PlayerResearch.transient = ['_advanceRegistry', '_rulesRegistry'];
exports.default = PlayerResearch;
//# sourceMappingURL=PlayerResearch.js.map