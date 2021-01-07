import Advance from '../Advance';
import { IRuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Rule from '@civ-clone/core-rule/Rule';
export declare class Requirements extends Rule<
  [typeof Advance, Advance[]],
  boolean
> {}
export default Requirements;
export interface IResearchRequirementsRegistry
  extends IRuleRegistry<Requirements, [typeof Advance, Advance[]], boolean> {}
