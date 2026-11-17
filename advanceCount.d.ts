import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import PlayerResearch from './PlayerResearch';
/**
 * How many advances `playerResearch` is counted as knowing: the first of the `AdvanceCount` rules' answers, or, with
 *  none, every advance it knows.
 */
export declare const advanceCount: (
  playerResearch: PlayerResearch,
  ruleRegistry?: RuleRegistry
) => number;
export default advanceCount;
