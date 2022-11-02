import Advance from '../Advance';
import Rule from '@civ-clone/core-rule/Rule';
import PlayerResearch from '../PlayerResearch';

export class Cost extends Rule<[typeof Advance, PlayerResearch], number> {}

export default Cost;
