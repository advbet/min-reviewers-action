import * as core from "@actions/core";
import { run } from "./min-approvals";

run()
  .then(() => {
    core.info("Done.");
  })
  .catch((e) => {
    core.error(e.message);
  });
