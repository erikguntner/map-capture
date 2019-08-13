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
  try {
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

    // Stringify coords before using them as query string
    // const coordsJSONStr = JSON.stringify(config.coordinates);
    // goto page with map sending coordintaes along
    await page.goto(`${process.env.CLIENT_URL}${queryString}`, {
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
    console.log(image);
  } catch (err) {
    console.log('error mothafucka', err);
  }
};

takeScreenShot(config);
