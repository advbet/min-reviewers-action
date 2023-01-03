import * as core from "@actions/core";
import { run } from "./min-reviewers";

run()
  .then(() => {
    core.info("Done.");
  })
  .catch((e) => {
    core.error(e.message);
  });
