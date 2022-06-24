import { testMarket } from "./Market/Market.test";
import { baseContext } from "./shared/contexts";

baseContext("Tests", function () {
  testMarket();
});
