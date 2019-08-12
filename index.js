const puppeteer = require('puppeteer');

const Constants = require('./constants/index');
const writeFileToDesktop = require('./utils/writeToDesktop');

const coors = [[-117.731672, 34.106999], [-117.72708, 34.107004]];

const screenshotMap = async coordinates => {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    // open new browser
    const page = await browser.newPage();

    // Stringify coords before using them as query string
    const coordsJSONStr = JSON.stringify(coordinates);

    // goto page with map sending coordintaes along
    await page.goto(
      `https://pacific-crag-45485.herokuapp.com/test?coords=${coordsJSONStr}`,
      {
        waitUntil: 'networkidle0',
      }
    );

    // wait for map to load, call onLoad callback, and set state to make the h1 visible
    // await page.waitForSelector('h1');
    // wait one more second to make sure all tiles for the map are loaded. Longer routes can require significantly more tiles
    await page.waitFor(1000);

    const image = await page.screenshot({
      type: 'jpeg',
      quality: 100,
      clip: {
        x: 0,
        y: 70,
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

takeScreenShot(Constants.coordinates);
