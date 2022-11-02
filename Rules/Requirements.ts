import Advance from '../Advance';
import Rule from '@civ-clone/core-rule/Rule';

export class Requirements extends Rule<[typeof Advance, Advance[]], boolean> {}

export default Requirements;
