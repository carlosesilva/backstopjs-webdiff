const fs = require("fs");
const backstop = require("backstopjs");
const options = require("./lib/cli-arguments");
const utils = require("./lib/utils");

// Parse environment urls.
const referenceEnv = utils.sanitizeEnvUrl(options["reference-env"]);
const testEnv = utils.sanitizeEnvUrl(options["test-env"]);

// Validate env urls.
if (!referenceEnv || !testEnv) {
  utils.handleError(
    "Please make sure to provide valid urls for --reference-env and --test-env"
  );
}

// Read Backstop config file.
const backstopConfig = JSON.parse(fs.readFileSync("./backstop.json"));

// Validate backstop config.
if (!backstopConfig || !backstopConfig.defaultScenario) {
  utils.handleError(
    "Please make sure there is a defaultScenario in './backstop.json'."
  );
}

// Read urls paths from provided file
const urls = utils.readUrls(options.urls, true);
const paths = urls.map(utils.getPagePath);

// Generate Scenarios
backstopConfig.scenarios = paths.map(path => {
  return utils.createScenario(
    backstopConfig.defaultScenario,
    path,
    testEnv,
    referenceEnv
  );
});

// Initialize backstop promise chain
const backstopChain = Promise.resolve();

backstopChain
  .then(() => {
    // Create references
    if (!options["skip-reference"]) {
      return backstop("reference", { config: backstopConfig });
    }
    return;
  })
  .then(() => {
    // Run tests
    if (!options["skip-test"]) {
      return backstop("test", { config: backstopConfig });
    }
    return;
  })
  .catch(utils.handleError);
