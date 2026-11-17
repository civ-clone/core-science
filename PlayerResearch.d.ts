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
export type PlayerResearchClearedReason = 'acquired' | 'completed' | string;
export interface IPlayerResearchCleared {
  reason: PlayerResearchClearedReason;
  advance: typeof Advance;
}
/** How an advance is added: `starting`, whether the player starts the game with it rather than gaining it in play. */
export interface AddAdvanceOptions {
  starting?: boolean;
}
export interface IPlayerResearch extends IDataObject {
  add(researchYield: Research): void;
  addAdvance(
    CompleteAdvance: typeof Advance,
    options?: AddAdvanceOptions
  ): void;
  available(): (typeof Advance)[];
  check(): void;
  cleared(): IPlayerResearchCleared | null;
  complete(): Advance[];
  completed(CompleteAdvance: typeof Advance): boolean;
  cost(): Research;
  player(): Player;
  progress(): Research;
  research(AdvanceToResearch: typeof Advance): void;
  researching(): typeof Advance | null;
  startingAdvances(): Advance[];
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
  private _starting?;
  constructor(
    player: Player,
    advanceRegistry?: AdvanceRegistry,
    rulesRegistry?: RuleRegistry
  );
  /**
   * A save keeps the keys the research had when it was made, so research loaded from a save made before a key existed
   *  would never send it, however often it was saved again (civ-clone/web-renderer#870). Adds those it's missing.
   */
  onHydrated(): void;
  add(researchYield: Research): void;
  /**
   * Adds `CompleteAdvance` to the advances the player knows, unless it's known already and not repeatable. `starting`:
   *  whether it's one the player starts the game with (`startingAdvances()`), rather than one gained in play.
   */
  addAdvance(
    CompleteAdvance: typeof Advance,
    { starting }?: AddAdvanceOptions
  ): void;
  available(): (typeof Advance)[];
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
  /**
   * The advances the player started the game with (`addAdvance`'s `starting`), in the order they were added: those of
   *  `complete()` that weren't gained in play. None for a game saved before they were kept.
   */
  startingAdvances(): Advance[];
}
export default PlayerResearch;
