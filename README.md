# backstopjs-webdiff

BackstopJS script to read a list urls from `.txt` file and compare them across 2 different environments.

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

## How to use

1.  Run program

    ```
    $ node compare.js --reference-env 'http://www.example.com' --test-env 'http://staging.example.com' --urls /path/to/urls.txt
    ```

    Where `urls.txt` is a list of urls like this:

    ```
    http://www.example.com/
    http://www.example.com/about/
    http://www.example.com/gallery/
    http://www.example.com/contact/
    ```

    This will compare the following screenshots:

    - `http://www.example.com/` vs `http://staging.example.com/`
    - `http://www.example.com/about/` vs `http://staging.example.com/about/`
    - `http://www.example.com/gallery/` vs `http://staging.example.com/gallery/`
    - `http://www.example.com/contact/` vs `http://staging.example.com/contact/`

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
