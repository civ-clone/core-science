import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import AdvanceCount from './Rules/AdvanceCount';
import PlayerResearch from './PlayerResearch';

/**
 * How many advances `playerResearch` is counted as knowing: the first of the `AdvanceCount` rules' answers, or, with
 *  none, every advance it knows.
 */
export const advanceCount = (
  playerResearch: PlayerResearch,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): number => {
  const [count] = ruleRegistry.process(AdvanceCount, playerResearch);

  return count ?? playerResearch.complete().length;
};

export default advanceCount;
