"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PlayerResearch_advanceRegistry, _PlayerResearch_complete, _PlayerResearch_researching, _PlayerResearch_player, _PlayerResearch_cost, _PlayerResearch_progress, _PlayerResearch_rulesRegistry;
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
        _PlayerResearch_advanceRegistry.set(this, void 0);
        _PlayerResearch_complete.set(this, []);
        _PlayerResearch_researching.set(this, null);
        _PlayerResearch_player.set(this, void 0);
        _PlayerResearch_cost.set(this, new Yields_1.Research(Infinity));
        _PlayerResearch_progress.set(this, new Yields_1.Research(0));
        _PlayerResearch_rulesRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _PlayerResearch_advanceRegistry, advanceRegistry, "f");
        __classPrivateFieldSet(this, _PlayerResearch_player, player, "f");
        __classPrivateFieldSet(this, _PlayerResearch_rulesRegistry, rulesRegistry, "f");
        this.addKey('available', 'complete', 'cost', 'progress', 'researching');
    }
    add(researchYield) {
        __classPrivateFieldGet(this, _PlayerResearch_progress, "f").add(researchYield);
        this.check();
    }
    addAdvance(CompleteAdvance) {
        if (__classPrivateFieldGet(this, _PlayerResearch_complete, "f").some((advance) => advance instanceof CompleteAdvance)) {
            return;
        }
        if (__classPrivateFieldGet(this, _PlayerResearch_researching, "f") === CompleteAdvance) {
            __classPrivateFieldSet(this, _PlayerResearch_researching, null, "f");
        }
        const completedResearch = new CompleteAdvance();
        __classPrivateFieldGet(this, _PlayerResearch_complete, "f").push(completedResearch);
        __classPrivateFieldGet(this, _PlayerResearch_rulesRegistry, "f").process(Complete_1.default, this, completedResearch);
    }
    available() {
        const rules = __classPrivateFieldGet(this, _PlayerResearch_rulesRegistry, "f").get(Requirements_1.default);
        return __classPrivateFieldGet(this, _PlayerResearch_advanceRegistry, "f").filter((AvailableAdvance) => rules
            .filter((rule) => rule.validate(AvailableAdvance, __classPrivateFieldGet(this, _PlayerResearch_complete, "f")))
            .every((rule) => rule.process(AvailableAdvance, __classPrivateFieldGet(this, _PlayerResearch_complete, "f")) === true) &&
            !__classPrivateFieldGet(this, _PlayerResearch_complete, "f").some((advance) => advance instanceof AvailableAdvance));
    }
    check() {
        if (__classPrivateFieldGet(this, _PlayerResearch_researching, "f") !== null &&
            __classPrivateFieldGet(this, _PlayerResearch_progress, "f").value() >= __classPrivateFieldGet(this, _PlayerResearch_cost, "f").value()) {
            const completedResearch = new (__classPrivateFieldGet(this, _PlayerResearch_researching, "f"))();
            __classPrivateFieldGet(this, _PlayerResearch_complete, "f").push(completedResearch);
            __classPrivateFieldSet(this, _PlayerResearch_researching, null, "f");
            __classPrivateFieldGet(this, _PlayerResearch_progress, "f").subtract(__classPrivateFieldGet(this, _PlayerResearch_cost, "f"));
            __classPrivateFieldGet(this, _PlayerResearch_cost, "f").set(Infinity);
            __classPrivateFieldGet(this, _PlayerResearch_rulesRegistry, "f").process(Complete_1.default, this, completedResearch);
        }
    }
    complete() {
        return __classPrivateFieldGet(this, _PlayerResearch_complete, "f");
    }
    completed(CompleteAdvance) {
        return __classPrivateFieldGet(this, _PlayerResearch_complete, "f").some((advance) => advance instanceof CompleteAdvance);
    }
    cost() {
        return __classPrivateFieldGet(this, _PlayerResearch_cost, "f");
    }
    player() {
        return __classPrivateFieldGet(this, _PlayerResearch_player, "f");
    }
    progress() {
        return __classPrivateFieldGet(this, _PlayerResearch_progress, "f");
    }
    research(AdvanceToResearch) {
        const [cost] = __classPrivateFieldGet(this, _PlayerResearch_rulesRegistry, "f").process(Cost_1.default, AdvanceToResearch, this);
        __classPrivateFieldGet(this, _PlayerResearch_cost, "f").set(cost);
        __classPrivateFieldSet(this, _PlayerResearch_researching, AdvanceToResearch, "f");
        __classPrivateFieldGet(this, _PlayerResearch_rulesRegistry, "f").process(Started_1.default, this, AdvanceToResearch);
    }
    researching() {
        return __classPrivateFieldGet(this, _PlayerResearch_researching, "f");
    }
}
exports.PlayerResearch = PlayerResearch;
_PlayerResearch_advanceRegistry = new WeakMap(), _PlayerResearch_complete = new WeakMap(), _PlayerResearch_researching = new WeakMap(), _PlayerResearch_player = new WeakMap(), _PlayerResearch_cost = new WeakMap(), _PlayerResearch_progress = new WeakMap(), _PlayerResearch_rulesRegistry = new WeakMap();
exports.default = PlayerResearch;
//# sourceMappingURL=PlayerResearch.js.map