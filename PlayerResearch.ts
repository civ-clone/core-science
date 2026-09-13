import {
  AdvanceRegistry,
  instance as advanceRegistryInstance,
} from './AdvanceRegistry';
import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Advance from './Advance';
import Complete from './Rules/Complete';
import Cost from './Rules/Cost';
import Player from '@civ-clone/core-player/Player';
import Requirements from './Rules/Requirements';
import { Research } from './Yields';
import Started from './Rules/Started';

export interface IPlayerResearch extends IDataObject {
  add(researchYield: Research): void;
  addAdvance(CompleteAdvance: typeof Advance): void;
  available(): typeof Advance[];
  check(): void;
  complete(): Advance[];
  completed(CompleteAdvance: typeof Advance): boolean;
  cost(): Research;
  player(): Player;
  progress(): Research;
  research(AdvanceToResearch: typeof Advance): void;
  researching(): typeof Advance | null;
}

export class PlayerResearch extends DataObject implements IPlayerResearch {
  static readonly transient = ['_advanceRegistry', '_rulesRegistry'];
  private _advanceRegistry: AdvanceRegistry;
  private _complete: Advance[] = [];
  private _researching: typeof Advance | null = null;
  private _player: Player;
  private _cost: Research = new Research(Infinity);
  private _progress: Research = new Research(0);
  private _rulesRegistry: RuleRegistry;

  constructor(
    player: Player,
    advanceRegistry: AdvanceRegistry = advanceRegistryInstance,
    rulesRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super();

    this._advanceRegistry = advanceRegistry;
    this._player = player;
    this._rulesRegistry = rulesRegistry;

    this.addKey('available', 'complete', 'cost', 'progress', 'researching');
  }

  add(researchYield: Research): void {
    this._progress.add(researchYield);

    this.check();
  }

  addAdvance(CompleteAdvance: typeof Advance): void {
    if (
      this._complete.some(
        (advance: Advance): boolean => advance instanceof CompleteAdvance
      )
    ) {
      return;
    }

    if (this._researching === CompleteAdvance) {
      this._researching = null;
    }

    const completedResearch = new CompleteAdvance();

    this._complete.push(completedResearch);
    this._rulesRegistry.process(Complete, this, completedResearch);
  }

  available(): typeof Advance[] {
    const rules: Requirements[] = this._rulesRegistry.get(Requirements);

    return this._advanceRegistry.filter(
      (AvailableAdvance: typeof Advance): boolean =>
        rules
          .filter((rule: Requirements): boolean =>
            rule.validate(AvailableAdvance, this._complete)
          )
          .every(
            (rule: Requirements): boolean =>
              rule.process(AvailableAdvance, this._complete) === true
          ) &&
        !this._complete.some(
          (advance: Advance): boolean => advance instanceof AvailableAdvance
        )
    );
  }

  check(): void {
    if (
      this._researching !== null &&
      this._progress.value() >= this._cost.value()
    ) {
      const completedResearch = new this._researching();

      this._complete.push(completedResearch);
      this._researching = null;
      this._progress.subtract(this._cost);

      this._cost.set(Infinity);

      this._rulesRegistry.process(Complete, this, completedResearch);
    }
  }

  complete(): Advance[] {
    return this._complete;
  }

  completed(CompleteAdvance: typeof Advance): boolean {
    return this._complete.some(
      (advance: Advance): boolean => advance instanceof CompleteAdvance
    );
  }

  cost(): Research {
    return this._cost;
  }

  player(): Player {
    return this._player;
  }

  progress(): Research {
    return this._progress;
  }

  research(AdvanceToResearch: typeof Advance): void {
    const [cost] = this._rulesRegistry.process(Cost, AdvanceToResearch, this);

    this._cost.set(cost);
    this._researching = AdvanceToResearch;

    this._rulesRegistry.process(Started, this, AdvanceToResearch);
  }

  researching(): typeof Advance | null {
    return this._researching;
  }
}

export default PlayerResearch;
