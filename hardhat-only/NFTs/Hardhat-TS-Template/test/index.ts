import { baseContext } from "./shared/contexts";
import { testUselessBank } from "./UselessBank/UselessBank.test";

baseContext("Tests", function () {
  testUselessBank();
});
