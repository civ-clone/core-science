import { instance as additionalDataRegistryInstance } from '@civ-clone/core-data-object/AdditionalDataRegistry';
import research from './AdditionalData/research';

additionalDataRegistryInstance.register(...research());
