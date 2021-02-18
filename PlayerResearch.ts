import {
  AdvanceRegistry,
  instance as advanceRegistryInstance,
} from './AdvanceRegistry';
import { Complete, IResearchCompleteRegistry } from './Rules/Complete';
import {
  Requirements,
  IResearchRequirementsRegistry,
} from './Rules/Requirements';
import { Cost, IResearchCostRegistry } from './Rules/Cost';
import { Started, IResearchStartedRegistry } from './Rules/Started';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Advance from './Advance';
import Player from '@civ-clone/core-player/Player';
import { Research } from './Yields';
import DataObject, {
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';

export interface IPlayerResearch extends IDataObject {
  add(researchYield: Research): void;
  addAdvance(CompleteAdvance: typeof Advance): void;
  available(): Advance[];
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
  #advanceRegistry: AdvanceRegistry;
  #complete: Advance[] = [];
  #researching: typeof Advance | null = null;
  #player: Player;
  #cost: Research = new Research(Infinity);
  #progress: Research = new Research(0);
  #rulesRegistry: RuleRegistry;

  constructor(
    player: Player,
    advanceRegistry: AdvanceRegistry = advanceRegistryInstance,
    rulesRegistry: RuleRegistry = ruleRegistryInstance
  ) {
    super();

    this.#advanceRegistry = advanceRegistry;
    this.#player = player;
    this.#rulesRegistry = rulesRegistry;

    this.addKey('available', 'complete', 'cost', 'progress', 'researching');
  }

  add(researchYield: Research): void {
    this.#progress.add(researchYield);

    this.check();
  }

  addAdvance(CompleteAdvance: typeof Advance): void {
    if (
      this.#complete.some(
        (advance: Advance): boolean => advance instanceof CompleteAdvance
      )
    ) {
      return;
    }

    if (this.#researching === CompleteAdvance) {
      this.#researching = null;
    }

    const completedResearch = new CompleteAdvance();

    this.#complete.push(completedResearch);
    (this.#rulesRegistry as IResearchCompleteRegistry).process(
      Complete,
      this,
      completedResearch
    );
  }

  available(): typeof Advance[] {
    const rules: Requirements[] = (this
      .#rulesRegistry as IResearchRequirementsRegistry).get(Requirements);

    return this.#advanceRegistry.filter(
      (AvailableAdvance: typeof Advance): boolean =>
        rules
          .filter((rule: Requirements): boolean =>
            rule.validate(AvailableAdvance, this.#complete)
          )
          .every(
            (rule: Requirements): boolean =>
              rule.process(AvailableAdvance, this.#complete) === true
          ) &&
        !this.#complete.some(
          (advance: Advance): boolean => advance instanceof AvailableAdvance
        )
    );
  }

  check(): void {
    if (
      this.#researching !== null &&
      this.#progress.value() >= this.#cost.value()
    ) {
      const completedResearch = new this.#researching();

      this.#complete.push(completedResearch);
      this.#researching = null;
      this.#progress.subtract(this.#cost);

      this.#cost.set(Infinity);

      (this.#rulesRegistry as IResearchCompleteRegistry).process(
        Complete,
        this,
        completedResearch
      );
    }
  }

  complete(): Advance[] {
    return this.#complete;
  }

  completed(CompleteAdvance: typeof Advance): boolean {
    return this.#complete.some(
      (advance: Advance): boolean => advance instanceof CompleteAdvance
    );
  }

  cost(): Research {
    return this.#cost;
  }

  player(): Player {
    return this.#player;
  }

  progress(): Research {
    return this.#progress;
  }

  research(AdvanceToResearch: typeof Advance): void {
    const [cost] = (this.#rulesRegistry as IResearchCostRegistry).process(
      Cost,
      AdvanceToResearch,
      this
    );

    this.#cost.set(cost);
    this.#researching = AdvanceToResearch;

    (this.#rulesRegistry as IResearchStartedRegistry).process(
      Started,
      this,
      AdvanceToResearch
    );
  }

  researching(): typeof Advance | null {
    return this.#researching;
  }
}

export default PlayerResearch;
