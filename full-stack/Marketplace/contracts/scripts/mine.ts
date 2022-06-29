import { moveBlocks } from "../utils/scripts/moveBlocks";

const BLOCKS = 2;

const SLEEP_TIME = 1000;

async function mine() {
  await moveBlocks(BLOCKS, SLEEP_TIME);
}

mine()
  .then(() => process.exit)
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
