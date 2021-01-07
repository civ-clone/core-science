import Advance from '../Advance';
import AdvanceRegistry from '../AdvanceRegistry';
import Complete from '../Rules/Complete';
import Cost from '../Rules/Cost';
import Criterion from '@civ-clone/core-rule/Criterion';
import Effect from '@civ-clone/core-rule/Effect';
import Player from '@civ-clone/core-player/Player';
import PlayerResearch from '../PlayerResearch';
import Requirements from '../Rules/Requirements';
import Research from '../Yields/Research';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import * as chai from 'chai';
import * as spies from 'chai-spies';

const { expect, use } = chai;

use(spies);

describe('PlayerResearch', (): void => {
  it('should have expected default values', (): void => {
    const player = new Player(),
      playerResearch = new PlayerResearch(player);

    expect(playerResearch.complete()).to.empty;
    expect(playerResearch.cost().value()).to.equal(Infinity);
    expect(playerResearch.player()).to.equal(player);
    expect(playerResearch.progress().value()).to.equal(0);
  });

  it('should use `Rule`s to control availability of `Advance`s', (): void => {
    const advanceRegistry = new AdvanceRegistry(),
      ruleRegistry = new RuleRegistry(),
      playerResearch = new PlayerResearch(
        new Player(),
        advanceRegistry,
        ruleRegistry
      ),
      Level1 = class extends Advance {},
      Level2 = class extends Advance {};

    ruleRegistry.register(
      new Requirements(
        new Criterion((AdvanceType) => AdvanceType === Level2),
        new Effect((AdvanceType, completed) =>
          completed.some((advance) => advance instanceof Level1)
        )
      )
    );

    advanceRegistry.register(Level1, Level2);

    expect(playerResearch.available()).to.include(Level1);
    expect(playerResearch.available()).to.not.include(Level2);
  });

  it('should use `Rule`s to control cost of `Advance`s', (): void => {
    const advanceRegistry = new AdvanceRegistry(),
      ruleRegistry = new RuleRegistry(),
      playerResearch = new PlayerResearch(
        new Player(),
        advanceRegistry,
        ruleRegistry
      ),
      Test = class extends Advance {},
      spy = chai.spy();

    ruleRegistry.register(
      new Cost(new Effect(() => 10)),
      new Complete(new Effect(spy))
    );

    advanceRegistry.register(Test);
    playerResearch.research(Test);

    expect(playerResearch.researching()).to.equal(Test);
    expect(playerResearch.cost().value()).to.equal(10);
    expect(playerResearch.progress().value()).to.equal(0);

    playerResearch.add(new Research(5));

    expect(playerResearch.progress().value()).to.equal(5);

    playerResearch.check();
    playerResearch.add(new Research(5));

    expect(playerResearch.progress().value()).to.equal(0);
    expect(spy).to.called.once;
    expect(playerResearch.complete().some((advance) => advance instanceof Test))
      .to.true;
    expect(playerResearch.completed(Test)).to.true;
  });

  it('should be possible to manually add `Advance`s', (): void => {
    const advanceRegistry = new AdvanceRegistry(),
      ruleRegistry = new RuleRegistry(),
      playerResearch = new PlayerResearch(
        new Player(),
        advanceRegistry,
        ruleRegistry
      ),
      Test = class extends Advance {},
      spy = chai.spy();

    ruleRegistry.register(
      new Cost(new Effect(() => 10)),
      new Complete(new Effect(spy))
    );

    advanceRegistry.register(Test);
    playerResearch.research(Test);
    playerResearch.addAdvance(Test);

    expect(spy).to.called.once;
    expect(playerResearch.complete().some((advance) => advance instanceof Test))
      .to.true;

    playerResearch.addAdvance(Test);

    expect(spy).to.called.once;
  });
});
