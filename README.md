# backstopjs-webdiff

Wrapper script around BackstopJS to read a list urls from a `.txt` file and compare them across 2 environments in a single command.

## Requirements

- NodeJS v8.3+

## Install

1.  Clone the repo
    ```
    $ git clone <repo url>
    ```
1.  cd into repo directory
    ```
    $ cd /path/to/repo
    ```
1.  Install dependencies
    ```
    $ npm install
    ```
1.  Now create a `urls.txt` file with the urls that you want to test like this:

    ```
    https://www.example.com/
    https://www.example.com/about/
    https://www.example.com/gallery/
    https://www.example.com/contact/
    ```

## How to use

### Scenario #1: Comparing 2 different environments

This method is useful to compare pages across 2 different environments such as: Prod vs Staging, Prod vs Sandbox, etc.

```
$ node compare.js --reference-env 'https://www.example.com' --test-env 'https://staging.example.com' --urls /path/to/urls.txt
```

Given the `urls.txt` example above, this will compare the following screenshots:

- `https://www.example.com/` vs `https://staging.example.com/`
- `https://www.example.com/about/` vs `https://staging.example.com/about/`
- `https://www.example.com/gallery/` vs `https://staging.example.com/gallery/`
- `https://www.example.com/contact/` vs `https://staging.example.com/contact/`

### Scenario #2: Comparing a single environment before and after a change.

This method is useful to check if a change, such as a server update or a 3rd party library update, caused any unexpected visual changes to your website.

1.  First you take the reference screenshots:

    ```
    $ node compare.js --reference-env 'https://www.example.com' --skip-test --urls /path/to/urls.txt
    ```

2.  Make the changes that you want to test
3.  Then you would take the test screenshots by running:

    ```
    $ node compare.js --test-env 'https://www.example.com' --skip-reference --urls /path/to/urls.txt
    ```

Given the `urls.txt` example above, this will compare the following screenshots:

- `https://www.example.com/`(before) vs `https://example.com/`(after)
- `https://www.example.com/about/`(before) vs `https://example.com/about/`(after)
- `https://www.example.com/gallery/`(before) vs `https://example.com/gallery/`(after)
- `https://www.example.com/contact/`(before) vs `https://example.com/contact/`(after)

## Customizing BackstopJS

We are using [BackstopJS](https://github.com/garris/BackstopJS) here in a pretty vanilla way
so you can change any settings you want in `backstop.json`. Read their docs for more information about that.

The only requirement is that there is a `defaultScenario` object in your `backstop.json` so that we can generate the scenarios on the fly using the `defaultScenario` settings.

For example:

```
{
...
  "scenarios": [],
  "defaultScenario": {
  	"label": "",
  	"url": "",
  	"referenceUrl": ""
  }
...
}
```

You can add customizations to the `defaultScenario` object and that will apply to every url.

```
{
...
  "scenarios": [],
  "defaultScenario": {
  	"label": "",
  	"url": "",
  	"referenceUrl": "",
  	"hideSelectors": [],
  	"selectors": [
  	"document"
  	],
  	"readyEvent": null,
  	"delay": 1500,
  	"misMatchThreshold": 0.1
  }
...
}
```

## Setting custom request headers

It is possible to send custom headers with each page request. To do so, create a `headers.json` file like this:

```
{
    "custom-header-1": "value1",
    "custom-header-2": "value2"
    ...
}
```

And point to it using the `--headers` parameter:

```
    node compare.js --reference-env 'https://www.example.com' \
    --test-env 'https://staging.example.com' \
    --urls /path/to/urls.txt \
    --headers /path/to/headers.json
```
