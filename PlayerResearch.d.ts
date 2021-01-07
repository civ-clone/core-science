import { AdvanceRegistry } from './AdvanceRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Advance from './Advance';
import Player from '@civ-clone/core-player/Player';
import { Research } from './Yields';
export interface IPlayerResearch {
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
export declare class PlayerResearch implements IPlayerResearch {
  #private;
  constructor(
    player: Player,
    advanceRegistry?: AdvanceRegistry,
    rulesRegistry?: RuleRegistry
  );
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
export default PlayerResearch;
