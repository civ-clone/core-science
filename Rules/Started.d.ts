import Advance from '../Advance';
import Rule from '@civ-clone/core-rule/Rule';
import PlayerResearch from '../PlayerResearch';
export declare class Started extends Rule<
  [PlayerResearch, typeof Advance],
  void
> {}
export default Started;
