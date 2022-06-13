import { testBasicNFT } from "./BasicNFT/BasicNFT.test";
import { baseContext } from "./shared/contexts";
import { testRandomNFT } from "./RandomNFT/RandomNFT.test";

baseContext("Tests", function () {
  testBasicNFT();
  testRandomNFT();
});
