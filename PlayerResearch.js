"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _advanceRegistry, _complete, _researching, _player, _cost, _progress, _rulesRegistry;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerResearch = void 0;
const AdvanceRegistry_1 = require("./AdvanceRegistry");
const Complete_1 = require("./Rules/Complete");
const Requirements_1 = require("./Rules/Requirements");
const Cost_1 = require("./Rules/Cost");
const Started_1 = require("./Rules/Started");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const Yields_1 = require("./Yields");
const DataObject_1 = require("@civ-clone/core-data-object/DataObject");
class PlayerResearch extends DataObject_1.default {
    constructor(player, advanceRegistry = AdvanceRegistry_1.instance, rulesRegistry = RuleRegistry_1.instance) {
        super();
        _advanceRegistry.set(this, void 0);
        _complete.set(this, []);
        _researching.set(this, null);
        _player.set(this, void 0);
        _cost.set(this, new Yields_1.Research(Infinity));
        _progress.set(this, new Yields_1.Research(0));
        _rulesRegistry.set(this, void 0);
        __classPrivateFieldSet(this, _advanceRegistry, advanceRegistry);
        __classPrivateFieldSet(this, _player, player);
        __classPrivateFieldSet(this, _rulesRegistry, rulesRegistry);
        this.addKey('available', 'complete', 'cost', 'progress', 'researching');
    }
    add(researchYield) {
        __classPrivateFieldGet(this, _progress).add(researchYield);
        this.check();
    }
    addAdvance(CompleteAdvance) {
        if (__classPrivateFieldGet(this, _complete).some((advance) => advance instanceof CompleteAdvance)) {
            return;
        }
        if (__classPrivateFieldGet(this, _researching) === CompleteAdvance) {
            __classPrivateFieldSet(this, _researching, null);
        }
        const completedResearch = new CompleteAdvance();
        __classPrivateFieldGet(this, _complete).push(completedResearch);
        __classPrivateFieldGet(this, _rulesRegistry).process(Complete_1.Complete, this, completedResearch);
    }
    available() {
        const rules = __classPrivateFieldGet(this, _rulesRegistry).get(Requirements_1.Requirements);
        return __classPrivateFieldGet(this, _advanceRegistry).filter((AvailableAdvance) => rules
            .filter((rule) => rule.validate(AvailableAdvance, __classPrivateFieldGet(this, _complete)))
            .every((rule) => rule.process(AvailableAdvance, __classPrivateFieldGet(this, _complete)) === true) &&
            !__classPrivateFieldGet(this, _complete).some((advance) => advance instanceof AvailableAdvance));
    }
    check() {
        if (__classPrivateFieldGet(this, _researching) !== null &&
            __classPrivateFieldGet(this, _progress).value() >= __classPrivateFieldGet(this, _cost).value()) {
            const completedResearch = new (__classPrivateFieldGet(this, _researching))();
            __classPrivateFieldGet(this, _complete).push(completedResearch);
            __classPrivateFieldSet(this, _researching, null);
            __classPrivateFieldGet(this, _progress).subtract(__classPrivateFieldGet(this, _cost));
            __classPrivateFieldGet(this, _cost).set(Infinity);
            __classPrivateFieldGet(this, _rulesRegistry).process(Complete_1.Complete, this, completedResearch);
        }
    }
    complete() {
        return __classPrivateFieldGet(this, _complete);
    }
    completed(CompleteAdvance) {
        return __classPrivateFieldGet(this, _complete).some((advance) => advance instanceof CompleteAdvance);
    }
    cost() {
        return __classPrivateFieldGet(this, _cost);
    }
    player() {
        return __classPrivateFieldGet(this, _player);
    }
    progress() {
        return __classPrivateFieldGet(this, _progress);
    }
    research(AdvanceToResearch) {
        const [cost] = __classPrivateFieldGet(this, _rulesRegistry).process(Cost_1.Cost, AdvanceToResearch, this);
        __classPrivateFieldGet(this, _cost).set(cost);
        __classPrivateFieldSet(this, _researching, AdvanceToResearch);
        __classPrivateFieldGet(this, _rulesRegistry).process(Started_1.Started, this, AdvanceToResearch);
    }
    researching() {
        return __classPrivateFieldGet(this, _researching);
    }
}
exports.PlayerResearch = PlayerResearch;
_advanceRegistry = new WeakMap(), _complete = new WeakMap(), _researching = new WeakMap(), _player = new WeakMap(), _cost = new WeakMap(), _progress = new WeakMap(), _rulesRegistry = new WeakMap();
exports.default = PlayerResearch;
//# sourceMappingURL=PlayerResearch.js.map