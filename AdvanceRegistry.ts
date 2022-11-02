import Advance from './Advance';
import {
  ConstructorRegistry,
  IConstructorRegistry,
} from '@civ-clone/core-registry/ConstructorRegistry';

export interface IAdvanceRegistry extends IConstructorRegistry<Advance> {}

export class AdvanceRegistry
  extends ConstructorRegistry<Advance>
  implements IAdvanceRegistry
{
  constructor() {
    super(Advance);
  }
}

export const instance: AdvanceRegistry = new AdvanceRegistry();

export default AdvanceRegistry;
