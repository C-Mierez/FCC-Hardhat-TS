import { buyItem } from "./buyItem.spec";
import { claimProceeds } from "./claimProceeds.spec";
import { listItem } from "./listItem.spec";
import { updateItem } from "./updateItem.spec";
import { withdrawItem } from "./withdrawItem.spec";
export function testMarket() {
  describe("Market", async () => {
    describe("#constructor", async () => {});

    describe("#listItem", async () => {
      listItem();
    });

    describe("#buyItem", async () => {
      buyItem();
    });

    describe("#withdrawItem", async () => {
      withdrawItem();
    });

    describe("#updateItem", async () => {
      updateItem();
    });

    describe("#claimProceeds", async () => {
      claimProceeds();
    });
  });
}
