import { Item, QUALITY } from "./Item";

const AGED_BRIE = "Aged Brie";
const BACKSTAGE_PASSES = "Backstage passes to a TAFKAL80ETC concert";
const SULFURAS = "Sulfuras, Hand of Ragnaros";
const CONJURED = "Conjured";

export class GildedRose {
  items: Item[];

  constructor(items: Item[]) {
    this.items = items ?? [];
  }

  updateQuality() {
    return this.items.map((item) => {
      switch (item.name) {
        case SULFURAS: {
          return updateSulfuras(item);
        }
        case AGED_BRIE: {
          return updateAgedBrie(item);
        }
        case BACKSTAGE_PASSES: {
          return updateBackStagePasses(item);
        }
        case CONJURED: {
          return updateConjured(item);
        }
        default: {
          const { quality, sellIn } = item;

          // Once the sell by date has passed, Quality degrades twice as fast
          const updatedQuality = isPastDate(sellIn)
            ? decreaseQuality(decreaseQuality(quality))
            : decreaseQuality(quality);

          return new Item(item.name, decreaseSellIn(sellIn), updatedQuality);
        }
      }
    });
  }
}

/**
 *
 * Is the sellIn date in the past?
 *
 * @param sellIn
 * @returns boolean
 */

function isPastDate(sellIn: number) {
  return sellIn <= 0;
}

/**
 * Decrease the given quality value by one.
 *
 * @param quality
 * @returns number
 */
function decreaseQuality(quality: number) {
  return Math.min(Math.max(quality - 1, QUALITY.MIN), QUALITY.MAX);
}

/**
 * Decrease the given sellIn value by one.
 *
 * @param sellIn
 * @returns number
 */
function decreaseSellIn(sellIn: number) {
  return sellIn - 1;
}

/**
 * Increase the given quality value by one.
 *
 * @param quality
 * @returns number
 */
function increaseQuality(quality: number) {
  return Math.min(Math.max(quality + 1, QUALITY.MIN), QUALITY.MAX);
}

/**
 * "Aged Brie" actually increases in Quality the older it gets.
 *
 * @param item
 * @returns Item
 */
function updateAgedBrie(item: Item): Item {
  return new Item(
    item.name,
    decreaseSellIn(item.sellIn),
    increaseQuality(item.quality)
  );
}

/**
 * "Conjured" items degrade in Quality twice as fast as normal items
 *
 * @param item
 * @returns Item
 */

function updateConjured(item: Item): Item {
  return new Item(
    item.name,
    decreaseSellIn(item.sellIn),
    decreaseQuality(decreaseQuality(item.quality))
  );
}

/**
 * "Sulfuras", being a legendary item, never has to be sold or decreases in Quality
 *
 * @param item
 * @returns Item
 */
function updateSulfuras(item: Item): Item {
  return new Item(item.name, item.sellIn, 80);
}

/**
 * "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches;
 * Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but
 * Quality drops to 0 after the concert
 *
 * @param item
 * @returns Item
 */
function updateBackStagePasses(item: Item): Item {
  const { quality, sellIn } = item;

  let updatedQuality = quality;
  if (sellIn === 0) {
    return new Item(item.name, decreaseSellIn(sellIn), 0);
  }

  if (sellIn > 10) {
    updatedQuality = increaseQuality(quality);
  } else if (sellIn > 5) {
    updatedQuality = increaseQuality(increaseQuality(quality));
  } else if (sellIn < 5) {
    updatedQuality = increaseQuality(increaseQuality(increaseQuality(quality)));
  }

  return new Item(item.name, decreaseSellIn(sellIn), updatedQuality);
}
