const puppeteer = require('puppeteer');
require('dotenv').config();

const Constants = require('./constants/index');
const writeFileToDesktop = require('./utils/writeToDesktop');

// Test Config Object
const config = {
  coordinates: Constants.coordinates,
  mapboxToken: process.env.MAPBOX_TOKEN,
};

const screenshotMap = async config => {
  // TODO: define default configuration object.
  // Overwrite object using Object.assign()
  const defaultConfig = {
    coordinates: [],
    mapboxToken: '',
    screenSize: [360, 640],
    color: 'red',
    lineWidth: 2,
    padding: 5,
  };

  try {
    const updatedConfig = Object.assign(defaultConfig, config);

    // Loop over config object and contrust query string for URL
    const queryString = Object.keys(config).reduce((accum, key, i) => {
      let query = `${key}=${JSON.stringify(config[key])}`;
      if (i !== Object.keys(config).length - 1) query += '&';
      return accum + query;
    }, '');

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // open new browser
    const page = await browser.newPage();

    const URL =
      process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_URL
        : 'http://localhost:3000/?';

    // goto page with map sending coordintaes along
    await page.goto(`${URL}${queryString}`, {
      waitUntil: 'networkidle0',
    });

    // wait for map to load, call onLoad callback, and set state to make the h1 visible
    // await page.waitForSelector('h1');
    // wait one more second to make sure all tiles for the map are loaded. Longer routes can require significantly more tiles
    await page.waitFor(1000);

    const image = await page.screenshot({
      type: 'jpeg',
      quality: 100,
      clip: {
        x: 0,
        y: 0,
        width: 640,
        height: 360,
      },
      omitBackground: true,
    });

    await browser.close();

    // return image;

    // Test function for writing the image to the desktop
    writeFileToDesktop.writeFileToDesktop(image);
  } catch (err) {
    return err;
  }
};

const takeScreenShot = async coords => {
  try {
    const image = await screenshotMap(coords);
    return image;
  } catch (err) {
    return err;
  }
};

takeScreenShot(config);
