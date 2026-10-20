import DataObject from '@civ-clone/core-data-object/DataObject';

export class Advance extends DataObject {
  // A repeatable advance can be researched again once it's known, each time adding another to the player's completed
  //  advances, and can't change hands: other players' completed advances, offered for trade or to steal, leave it out.
  static readonly repeatable?: boolean;
}

export default Advance;
