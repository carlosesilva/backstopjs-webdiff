/**
 * All the cli arguments handling
 */

const commandLineArgs = require("command-line-args");
const getUsage = require("command-line-usage");

// Define command line args accepted.
const optionDefinitions = [
  {
    name: "urls",
    type: String,
    required: true,
    description: "The filename of the file containing the list of URLs to load."
  },
  {
    name: "test-env",
    type: String,
    description:
      "The test environment. For example a staging environment: --test-env http://staging.example.com"
  },
  {
    name: "reference-env",
    type: String,
    description:
      "The reference environment. For example a production environment: --test-env http://example.com"
  },
  {
    name: "skip-reference",
    type: Boolean,
    description:
      "Skips the reference creation step. Use this to speedup subconsequent tests."
  },
  {
    name: "skip-test",
    type: Boolean,
    description:
      "Skips the test running step. Use this to create/regenerate your reference files."
  },
  {
    name: "headers",
    type: String,
    description:
      "A JSON file containing extra request headers to be sent on every page request."
  },
  {
    name: "help",
    type: Boolean,
    description: "Display this help screen."
  }
];

// Parse command line args.
const options = commandLineArgs(optionDefinitions);

// Define the help screen to be displayed if --help is present in options
const usageDefinition = [
  {
    header: "backstopjs-webdiff",
    content:
      "Given a list of urls and 2 environments, this app compares screenshots accross the environments using BackstopJS"
  },
  {
    header: "Options",
    optionList: optionDefinitions.map(definition => {
      if (definition.required) {
        definition.description = "(Required) " + definition.description;
      }
      return definition;
    })
  }
];

// If --help is present, display the help screen and exit the program.
if (options.help) {
  console.log(getUsage(usageDefinition));
  process.exit();
}

// If required fields are missing, display the help screen and exit the program.
optionDefinitions.forEach(definition => {
  if (definition.required && !options[definition.name]) {
    console.log(`Error: Missing required parameter: --${definition.name}.`);
    console.log(getUsage(usageDefinition));
    process.exit(1);
  }
});

// Check reference-env is provided unless skip-reference is specified.
if (!options["skip-reference"] && !options["reference-env"]) {
  console.log(`Error: Missing required parameter: --reference-env.`);
  console.log(getUsage(usageDefinition));
  process.exit(1);
}

// Check test-env is provided unless skip-test is specified.
if (!options["skip-test"] && !options["test-env"]) {
  console.log(`Error: Missing required parameter: --test-env.`);
  console.log(getUsage(usageDefinition));
  process.exit(1);
}

// Check that both skip flags are not present.
if (options["skip-reference"] && options["skip-test"]) {
  console.log(`Error: You can't skip both reference and test.`);
  console.log(getUsage(usageDefinition));
  process.exit(1);
}

// Export the options to be used.
module.exports = options;
