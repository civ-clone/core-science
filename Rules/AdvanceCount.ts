import PlayerResearch from '../PlayerResearch';
import Rule from '@civ-clone/core-rule/Rule';

/**
 * How many advances `playerResearch` is counted as knowing, for the rules that weigh what a player knows (a research
 *  cost, a ranking): every one, or only those gained in play, as a ruleset counts them. The first answer holds; with
 *  none, every advance the player knows (`advanceCount`).
 */
export class AdvanceCount extends Rule<
  [playerResearch: PlayerResearch],
  number
> {}

export default AdvanceCount;
