import Advance from '../Advance';
import { IRuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Rule from '@civ-clone/core-rule/Rule';
import PlayerResearch from '../PlayerResearch';
export declare class Started extends Rule<
  [PlayerResearch, typeof Advance],
  void
> {}
export default Started;
export interface IResearchStartedRegistry
  extends IRuleRegistry<Started, [PlayerResearch, typeof Advance], void> {}
