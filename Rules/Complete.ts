import Advance from '../Advance';
import Rule from '@civ-clone/core-rule/Rule';
import PlayerResearch from '../PlayerResearch';

export class Complete extends Rule<[PlayerResearch, Advance], void> {}

export default Complete;
