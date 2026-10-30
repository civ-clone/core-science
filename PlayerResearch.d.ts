import { AdvanceRegistry } from './AdvanceRegistry';
import {
  DataObject,
  IDataObject,
} from '@civ-clone/core-data-object/DataObject';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Advance from './Advance';
import Player from '@civ-clone/core-player/Player';
import { Research } from './Yields';
/**
 * Why a player is researching nothing (civ-clone/web-renderer#726): they discovered `advance` (`completed`), or were
 *  given the advance they were researching some other way (`acquired`). A ruleset may give its own reasons.
 */
export declare type PlayerResearchClearedReason =
  | 'acquired'
  | 'completed'
  | string;
export interface IPlayerResearchCleared {
  reason: PlayerResearchClearedReason;
  advance: typeof Advance;
}
export interface IPlayerResearch extends IDataObject {
  add(researchYield: Research): void;
  addAdvance(CompleteAdvance: typeof Advance): void;
  available(): typeof Advance[];
  check(): void;
  cleared(): IPlayerResearchCleared | null;
  complete(): Advance[];
  completed(CompleteAdvance: typeof Advance): boolean;
  cost(): Research;
  player(): Player;
  progress(): Research;
  research(AdvanceToResearch: typeof Advance): void;
  researching(): typeof Advance | null;
}
export declare class PlayerResearch
  extends DataObject
  implements IPlayerResearch
{
  static readonly transient: string[];
  private _advanceRegistry;
  private _cleared;
  private _complete;
  private _researching;
  private _player;
  private _cost;
  private _progress;
  private _rulesRegistry;
  constructor(
    player: Player,
    advanceRegistry?: AdvanceRegistry,
    rulesRegistry?: RuleRegistry
  );
  add(researchYield: Research): void;
  addAdvance(CompleteAdvance: typeof Advance): void;
  available(): typeof Advance[];
  check(): void;
  /**
   * Why the player is researching nothing, or `null` while they research something, or when that isn't known (a new
   *  game, or an older save).
   */
  cleared(): IPlayerResearchCleared | null;
  complete(): Advance[];
  completed(CompleteAdvance: typeof Advance): boolean;
  cost(): Research;
  player(): Player;
  progress(): Research;
  research(AdvanceToResearch: typeof Advance): void;
  researching(): typeof Advance | null;
}
export default PlayerResearch;
