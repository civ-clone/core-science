import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '../PlayerResearchRegistry';
import AdditionalData from '@civ-clone/core-data-object/AdditionalData';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '../PlayerResearch';

export const getAdditionalData: (
  playerResearchRegistry?: PlayerResearchRegistry
) => AdditionalData[] = (
  playerResearchRegistry: PlayerResearchRegistry = playerResearchRegistryInstance
): AdditionalData[] => [
  new AdditionalData(
    Player,
    'research',
    (player: Player): PlayerResearch =>
      playerResearchRegistry.getByPlayer(player)
  ),
];

export default getAdditionalData;
