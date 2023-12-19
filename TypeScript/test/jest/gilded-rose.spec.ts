import { Item, ValidatedItem } from "@/Item";
import { GildedRose } from "@/gilded-rose";

function updateQuality(gildedRose: GildedRose): Item {
  const [item] = gildedRose.updateQuality();
  return item;
}

describe("Gilded Rose", () => {
  /**
   * * All items have a SellIn value which denotes the number of days we have to sell the items
   * * All items have a Quality value which denotes how valuable the item is
   */
  it("should all have the item properties", () => {
    const gildedRose = new GildedRose([new ValidatedItem("Normal", 0, 0)]);
    const { sellIn, name, quality } = updateQuality(gildedRose);

    expect(sellIn).toBeDefined();
    expect(name).toBeDefined();
    expect(quality).toBeDefined();
    expect(name).toBe("Normal");
  });

  /**
   * * At the end of each day our system lowers both values for every item
   */
  it("should update all properties at the end of the day", () => {
    const gildedRose = new GildedRose([new ValidatedItem("Normal", 5, 0)]);
    const { sellIn, name, quality } = updateQuality(gildedRose);

    expect(name).toBe("Normal");
    expect(sellIn).toBe(4);
    expect(quality).toBe(0);
  });

  describe("quality", () => {
    it("should not have a quality above 50", () => {
      const gildedRose = new GildedRose([new ValidatedItem("Normal", 10, 60)]);
      const { quality } = updateQuality(gildedRose);
      expect(quality).toBe(49);
    });

    /**
     * * Once the sell by date has passed, Quality degrades twice as fast
     */
    it("should decrease the quality twice as fast when sellIn date has passed", () => {
      const gildedRose = new GildedRose([new ValidatedItem("Normal", 0, 4)]);
      const { quality } = updateQuality(gildedRose);
      expect(quality).toBe(2);
    });

    /**
     * * The Quality of an item is never negative
     */
    it("should never have a negative quality", () => {
      const gildedRose = new GildedRose([new ValidatedItem("Normal", 0, -1)]);
      const { quality } = updateQuality(gildedRose);

      expect(quality).toBe(0);
    });

    /**
     * * The Quality of an item is never more than 50
     */
    it("should never have a quality of more than `50`", () => {
      const gildedRose = new GildedRose([
        new ValidatedItem("Aged Brie", 0, 50),
      ]);
      const { quality, sellIn } = updateQuality(gildedRose);

      expect(quality).toBe(50);
      expect(sellIn).toBe(-1);
    });
  });

  /**
   * * "Aged Brie" actually increases in Quality the older it gets
   */
  it('should increase the quality by 1 when the item is "Aged Brie"', () => {
    const gildedRose = new GildedRose([new ValidatedItem("Aged Brie", 1, 0)]);
    const { quality } = updateQuality(gildedRose);

    expect(quality).toBe(1);
  });

  /**
   * * "Sulfuras", being a legendary item, never has to be sold or decreases in Quality
   */
  it("should not decrease quality for sulfuras", () => {
    const gildedRose = new GildedRose([
      new ValidatedItem("Sulfuras, Hand of Ragnaros", 0, 80),
    ]);
    const { sellIn, quality } = updateQuality(gildedRose);

    expect(sellIn).toBe(0);
    expect(quality).toBe(80);
  });

  describe("backstage passes", () => {
    /**
     * * "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches;
     */
    it("should increase quality when there are more than 10 days left", () => {
      const gildedRose = new GildedRose([
        new ValidatedItem("Backstage passes to a TAFKAL80ETC concert", 20, 1),
      ]);
      const { sellIn, quality } = updateQuality(gildedRose);

      expect(sellIn).toBe(19);
      expect(quality).toBe(2);
    });

    it("should increase quality by `2` when there are more than 5 days left", () => {
      const gildedRose = new GildedRose([
        new ValidatedItem("Backstage passes to a TAFKAL80ETC concert", 6, 1),
      ]);
      const { sellIn, quality } = updateQuality(gildedRose);

      expect(sellIn).toBe(5);
      expect(quality).toBe(3);
    });

    it("should increase quality by `3` when there are less than 5 days left", () => {
      const gildedRose = new GildedRose([
        new ValidatedItem("Backstage passes to a TAFKAL80ETC concert", 4, 1),
      ]);
      const { sellIn, quality } = updateQuality(gildedRose);

      expect(sellIn).toBe(3);
      expect(quality).toBe(4);
    });

    it("should set quality to `0` when there are no days left", () => {
      const gildedRose = new GildedRose([
        new ValidatedItem("Backstage passes to a TAFKAL80ETC concert", 0, 1),
      ]);
      const { sellIn, quality } = updateQuality(gildedRose);

      expect(sellIn).toBe(-1);
      expect(quality).toBe(0);
    });
  });

  /**
   * * "Conjured" items degrade in Quality twice as fast as normal items
   */
  describe("conjured items", () => {
    it('should decrease quality twice as fast when the item is "Conjured"', () => {
      const gildedRose = new GildedRose([new ValidatedItem("Conjured", 10, 5)]);
      const { sellIn, quality } = updateQuality(gildedRose);

      expect(sellIn).toBe(9);
      expect(quality).toBe(3);
    });
  });

  /**
   * REQUIREMENTS
   *
   * * All items have a SellIn value which denotes the number of days we have to sell the items
   * * All items have a Quality value which denotes how valuable the item is
   * * At the end of each day our system lowers both values for every item
   *
   * * Once the sell by date has passed, Quality degrades twice as fast
   * * The Quality of an item is never negative
   * * "Aged Brie" actually increases in Quality the older it gets
   * * The Quality of an item is never more than 50
   * * "Sulfuras", being a legendary item, never has to be sold or decreases in Quality
   * * "Backstage passes", like aged brie, increases in Quality as its SellIn value approaches;
   * * Quality increases by 2 when there are 10 days or less and by 3 when there are 5 days or less but
   * * Quality drops to 0 after the concert
   * * "Conjured" items degrade in Quality twice as fast as normal items
   *
   */
});
