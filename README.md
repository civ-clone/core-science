# core-science

The basics of having the concept of research. Includes `Advance`s and associated `Registry`s and the `PlayerResearch`
class to manage a `Player`s research projects and progress towards it.

A `PlayerResearch` keeps apart the advances the player started the game with (added with
`addAdvance(Advance, { starting: true })`, read with `startingAdvances()`) from those gained in play.
`Rules/AdvanceCount` says how many advances a player is counted as knowing, for the rules that weigh it (a research
cost, a ranking); `advanceCount(playerResearch, ruleRegistry)` asks it, and counts every advance known when no rule
answers.
