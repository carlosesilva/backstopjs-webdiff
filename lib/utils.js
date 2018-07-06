const { URL } = require("url");
const fs = require("fs");

/**
 * Returns a copy of the array with unique items only.
 *
 * @param {array} a - The array we want to remove duplicates from.
 * @return {array} - A copy of the array with unique items only.
 */
function uniq(a) {
  // Initialize the hashtable.
  const seen = {};
  // Filter the array.
  return a.filter(item => {
    // If this item has already been seen before, filter it out.
    if (Object.prototype.hasOwnProperty.call(seen, item)) {
      return false;
    }
    // Add unique item to the hashtable.
    seen[item] = true;
    // Return true to keep the item.
    return true;
  });
}

/**
 * If the string is too long, trucate it on the middle and add a unique number for uniqueness.
 *
 * @param {string} str - The string to truncate if too long.
 * @param {int} maxLength - The longest length allowed.
 */
function truncateMiddleUnique(str, maxLength) {
  // If str is not longer than the max length just return it.
  if (str.length <= maxLength) {
    return str;
  }

  // Check to see if the unique counter has been initialized.
  if (typeof truncateMiddleUnique.counter == "undefined") {
    // It has not... perform the initialization
    truncateMiddleUnique.counter = 0;
  }

  // Construct the separator string.
  const separator = "--" + ++truncateMiddleUnique.counter + "--";

  // Calculate characters to show.
  const separatorLength = separator.length,
    charsToShow = maxLength - separatorLength,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  // Truncate string.
  const trucatedString =
    str.substr(0, frontChars) + separator + str.substr(str.length - backChars);

  // Return truncated string.
  return trucatedString;
}

/**
 * Reads urls from file into an array
 *
 * @param {string} urlsFile - The path to the file with the list of urls.
 * @return {array} - An array of urls.
 */
module.exports.readUrls = (urlsFile, verbose = false) => {
  // Check file exists first.
  if (!fs.existsSync(urlsFile)) {
    throw new Error(`The file ${urlsFile} does not exist.`);
  }

  // Grab list of urls from file.
  const rawUrls = fs
    .readFileSync(urlsFile)
    .toString()
    .split("\n");

  // Remove duplicates.
  const uniqueUrls = uniq(rawUrls);

  // Filter list of urls by only keeping valid ones.
  const filteredUrls = uniqueUrls.filter(url => {
    // Ignore empty lines.
    if (url === "") {
      return false;
    }
    // Try to transform url into a URL object.
    // It will throw an error if it is not valid.
    try {
      const validUrl = new URL(url);
      // No error was thrown so url is valid, lets keep it.
      return validUrl;
    } catch (error) {
      // Display error message if verbose is on.
      if (verbose) {
        console.log(`Removing invalid URL: "${url}"`);
      }

      // Url was invalid return false.
      return false;
    }
  });

  // If there are no valid URLs, exit early.
  if (filteredUrls.length === 0) {
    throw new Error("No valid urls found.");
  }

  // Return the filtered urls list.
  return filteredUrls;
};

/**
 * Sanitizes the environment's url
 *
 * @param {string} env - The env url.
 * @return {string|false} - Returns the url's protocol and host with no hanging slash.
 */
module.exports.sanitizeEnvUrl = env => {
  try {
    const envUrl = new URL(env);
    const sanitizedEnv = envUrl.origin;
    return sanitizedEnv;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Returns the url's path without the host.
 *
 * @param {string} url - The url.
 * @return {string|false} - The url without the host, or false on error.
 */
module.exports.getPagePath = url => {
  try {
    const parsedUrl = new URL(url);
    const path = parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
    return path;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * Generates an array of backstop scenarios
 *
 * @param {object} defaultScenario
 * @param {string} path
 * @param {string} testEnvironment
 * @param {string} referenceEnvironment
 */
module.exports.createScenario = (
  defaultScenario,
  path,
  testEnvironment,
  referenceEnvironment,
  headers = false
) => {
  const scenario = {
    ...defaultScenario,
    label: truncateMiddleUnique(path, 100),
    url: testEnvironment + path,
    referenceUrl: referenceEnvironment + path,
    headers
  };
  return scenario;
};

/**
 * Handles promise error.
 *
 * @param {error} error
 */
module.exports.handleError = error => {
  console.log(error);
  process.exit(1);
};
