import {
  EntityRegistry,
  IEntityRegistry,
} from '@civ-clone/core-registry/EntityRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from './PlayerResearch';

interface IPlayerResearchRegistry extends IEntityRegistry<PlayerResearch> {
  getByPlayer(player: Player): PlayerResearch;
}

export class PlayerResearchRegistry
  extends EntityRegistry<PlayerResearch>
  implements IPlayerResearchRegistry
{
  constructor() {
    super(PlayerResearch);
  }

  getByPlayer(player: Player): PlayerResearch {
    const playerResearch: PlayerResearch[] = this.getBy('player', player);

    if (playerResearch.length !== 1) {
      throw new TypeError('Wrong number of results for player.');
    }

    return playerResearch[0];
  }
}

export const instance: PlayerResearchRegistry = new PlayerResearchRegistry();

export default PlayerResearchRegistry;
