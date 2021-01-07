import Advance from '../Advance';
import { IRuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Rule from '@civ-clone/core-rule/Rule';
import PlayerResearch from '../PlayerResearch';
export declare class Cost extends Rule<
  [typeof Advance, PlayerResearch],
  number
> {}
export default Cost;
export interface IResearchCostRegistry
  extends IRuleRegistry<Cost, [typeof Advance, PlayerResearch], number> {}
