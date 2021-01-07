import Advance from './Advance';
import {
  ConstructorRegistry,
  IConstructorRegistry,
} from '@civ-clone/core-registry/ConstructorRegistry';
export interface IAdvanceRegistry extends IConstructorRegistry<Advance> {}
export declare class AdvanceRegistry
  extends ConstructorRegistry<Advance>
  implements IAdvanceRegistry {
  constructor();
}
export declare const instance: AdvanceRegistry;
export default AdvanceRegistry;
