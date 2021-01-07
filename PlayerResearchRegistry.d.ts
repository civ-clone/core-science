import {
  EntityRegistry,
  IEntityRegistry,
} from '@civ-clone/core-registry/EntityRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from './PlayerResearch';
interface IPlayerResearchRegistry extends IEntityRegistry<PlayerResearch> {
  getByPlayer(player: Player): PlayerResearch;
}
export declare class PlayerResearchRegistry
  extends EntityRegistry<PlayerResearch>
  implements IPlayerResearchRegistry {
  constructor();
  getByPlayer(player: Player): PlayerResearch;
}
export declare const instance: PlayerResearchRegistry;
export default PlayerResearchRegistry;
