import Advance from '../Advance';
import { IRuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Rule from '@civ-clone/core-rule/Rule';
import PlayerResearch from '../PlayerResearch';

export class Complete extends Rule<[PlayerResearch, Advance], void> {}

export default Complete;

export interface IResearchCompleteRegistry
  extends IRuleRegistry<Complete, [PlayerResearch, Advance], void> {}
