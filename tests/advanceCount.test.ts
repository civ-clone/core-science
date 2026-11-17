import Advance from '../Advance';
import AdvanceCount from '../Rules/AdvanceCount';
import AdvanceRegistry from '../AdvanceRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '../PlayerResearch';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import advanceCount from '../advanceCount';
import { expect } from 'chai';

describe('advanceCount (civ-clone/web-renderer#973)', (): void => {
  const setUp = () => {
    const ruleRegistry = new RuleRegistry(),
      playerResearch = new PlayerResearch(
        new Player(),
        new AdvanceRegistry(),
        ruleRegistry
      );

    playerResearch.addAdvance(class Started extends Advance {}, {
      starting: true,
    });
    playerResearch.addAdvance(class Gained extends Advance {});
    playerResearch.addAdvance(class AlsoGained extends Advance {});

    return { ruleRegistry, playerResearch };
  };

  it('should count every advance known when no rule says otherwise', (): void => {
    const { ruleRegistry, playerResearch } = setUp();

    expect(advanceCount(playerResearch, ruleRegistry)).to.equal(3);
  });

  it("should take the first `AdvanceCount` rule's answer", (): void => {
    const { ruleRegistry, playerResearch } = setUp();

    ruleRegistry.register(
      new AdvanceCount(
        new Effect(
          (research: PlayerResearch): number =>
            research.complete().length - research.startingAdvances().length
        )
      ),
      new AdvanceCount(new Effect((): number => 99))
    );

    expect(advanceCount(playerResearch, ruleRegistry)).to.equal(2);
  });
});
