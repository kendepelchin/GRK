export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

type Name =
  | "Sulfuras, Hand of Ragnaros"
  | "Aged Brie"
  | "Backstage passes to a TAFKAL80ETC concert"
  | "Conjured"
  | "Normal";

/**
 * The quality always have to be limited between 0 and 50.
 */
export const QUALITY = {
  MIN: 0,
  MAX: 50,
};

/**
 * A ValidatedItem is a wrapper around the regular Item class, but doing some
 * minor validation on quality & sellIn.
 *
 */
export class ValidatedItem extends Item {
  constructor(name: Name, sellIn, quality) {
    super(
      name.toString(),
      sellIn,
      quality > QUALITY.MAX ? QUALITY.MAX : quality
    );
  }
}
