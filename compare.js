const fs = require("fs");
const backstop = require("backstopjs");
const options = require("./lib/cli-arguments");
const utils = require("./lib/utils");

// Initialize variables
let referenceEnv = "",
  testEnv = "",
  headers = {};

// Parse environment urls.
if (!options["skip-reference"]) {
  referenceEnv = utils.sanitizeEnvUrl(options["reference-env"]);
  if (!referenceEnv) {
    utils.handleError(
      "Please make sure to provide valid urls for --reference-env"
    );
  }
}
if (!options["skip-test"]) {
  testEnv = utils.sanitizeEnvUrl(options["test-env"]);
  if (!testEnv) {
    utils.handleError("Please make sure to provide valid urls for --test-env");
  }
}

// Read Backstop config file.
const backstopConfig = JSON.parse(fs.readFileSync("./backstop.json"));

// Validate backstop config.
if (!backstopConfig || !backstopConfig.defaultScenario) {
  utils.handleError(
    "Please make sure there is a defaultScenario in './backstop.json'."
  );
}

// Add extra headers if a headers file is specified.
if (options["headers"]) {
  // Parse json file.
  const headersJSON = JSON.parse(fs.readFileSync(options["headers"]));

  if (headersJSON) {
    headers = headersJSON;
    // Specify the onBeforeScript to run so that it will add the headers on each page request.
    if (!backstopConfig.onBeforeScript) {
      backstopConfig.onBeforeScript = "onBefore.js";
    } else {
      utils.handleError(`You specified the --headers parameter but your backstop.json config file already has onBeforeScript defined. 
Require the setHeaders.js script in your custom onBefore script.`);
    }
  }
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
    referenceEnv,
    headers
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
