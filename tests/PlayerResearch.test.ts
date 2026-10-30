import { expect, spy, use } from 'chai';
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
import * as spies from 'chai-spies';

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
      effectSpy = spy();

    ruleRegistry.register(
      new Cost(new Effect(() => 10)),
      new Complete(new Effect(effectSpy))
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
    expect(effectSpy).to.called.once;
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
      effectSpy = spy();

    ruleRegistry.register(
      new Cost(new Effect(() => 10)),
      new Complete(new Effect(effectSpy))
    );

    advanceRegistry.register(Test);
    playerResearch.research(Test);
    playerResearch.addAdvance(Test);

    expect(effectSpy).to.called.once;
    expect(playerResearch.complete().some((advance) => advance instanceof Test))
      .to.true;

    playerResearch.addAdvance(Test);

    expect(effectSpy).to.called.once;
  });

  it('should offer a repeatable `Advance` again once it is known', (): void => {
    const advanceRegistry = new AdvanceRegistry(),
      ruleRegistry = new RuleRegistry(),
      playerResearch = new PlayerResearch(
        new Player(),
        advanceRegistry,
        ruleRegistry
      ),
      Once = class extends Advance {},
      Repeatable = class extends Advance {
        static readonly repeatable = true;
      },
      effectSpy = spy();

    ruleRegistry.register(
      new Cost(new Effect(() => 10)),
      new Complete(new Effect(effectSpy))
    );

    advanceRegistry.register(Once, Repeatable);

    playerResearch.research(Repeatable);
    playerResearch.add(new Research(10));
    playerResearch.addAdvance(Once);

    expect(playerResearch.available()).to.eql([Repeatable]);

    playerResearch.research(Repeatable);
    playerResearch.add(new Research(10));

    expect(
      playerResearch
        .complete()
        .filter((advance) => advance instanceof Repeatable)
    ).to.length(2);
    expect(playerResearch.available()).to.eql([Repeatable]);

    playerResearch.addAdvance(Repeatable);
    playerResearch.addAdvance(Once);

    expect(
      playerResearch
        .complete()
        .filter((advance) => advance instanceof Repeatable)
    ).to.length(3);
    expect(playerResearch.complete()).to.length(4);
    expect(effectSpy).to.called.exactly(4);
  });
  describe('why it is researching nothing (civ-clone/web-renderer#726)', (): void => {
    const setUp = () => {
      const advanceRegistry = new AdvanceRegistry(),
        ruleRegistry = new RuleRegistry(),
        playerResearch = new PlayerResearch(
          new Player(),
          advanceRegistry,
          ruleRegistry
        ),
        Test = class Test extends Advance {},
        Other = class Other extends Advance {};

      ruleRegistry.register(new Cost(new Effect(() => 10)));
      advanceRegistry.register(Test, Other);

      return { Other, Test, playerResearch, ruleRegistry };
    };

    it('should know of no reason to begin with', (): void => {
      const { playerResearch } = setUp();

      expect(playerResearch.cleared()).to.null;
    });

    it('should give the advance it discovered', (): void => {
      const { Test, playerResearch } = setUp();

      playerResearch.research(Test);
      playerResearch.add(new Research(10));

      expect(playerResearch.researching()).to.null;
      expect(playerResearch.cleared()).to.eql({
        reason: 'completed',
        advance: Test,
      });
    });

    it('should give the advance it was researching when it is acquired some other way', (): void => {
      const { Test, playerResearch } = setUp();

      playerResearch.research(Test);
      playerResearch.addAdvance(Test);

      expect(playerResearch.cleared()).to.eql({
        reason: 'acquired',
        advance: Test,
      });
    });

    it('should forget the reason when another advance is acquired while researching nothing', (): void => {
      const { Other, Test, playerResearch } = setUp();

      playerResearch.research(Test);
      playerResearch.add(new Research(10));
      playerResearch.addAdvance(Other);

      expect(playerResearch.cleared()).to.null;
    });

    it('should give none while it researches something, and forget it once something is chosen', (): void => {
      const { Other, Test, playerResearch } = setUp();

      playerResearch.research(Test);
      playerResearch.add(new Research(10));
      playerResearch.research(Other);

      expect(playerResearch.cleared()).to.null;

      playerResearch.addAdvance(Test);

      expect(playerResearch.cleared()).to.null;
    });

    it('should forget it when a `Complete` rule chooses the next', (): void => {
      const { Other, Test, playerResearch, ruleRegistry } = setUp();

      ruleRegistry.register(
        new Complete(
          new Effect((completed: PlayerResearch): void =>
            completed.research(Other)
          )
        )
      );

      playerResearch.research(Test);
      playerResearch.add(new Research(10));

      expect(playerResearch.researching()).to.equal(Other);
      expect(playerResearch.cleared()).to.null;
    });

    it('should give none for research restored from a save made before it existed', (): void => {
      const { Test, playerResearch } = setUp();

      playerResearch.research(Test);
      playerResearch.add(new Research(10));
      delete (playerResearch as unknown as { _cleared?: unknown })._cleared;

      expect(playerResearch.cleared()).to.null;
    });

    it('should be sent with the research', (): void => {
      const { playerResearch } = setUp();

      expect(playerResearch.keys()).to.include('cleared');
    });
  });
});
