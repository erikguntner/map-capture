const fs = require('fs');
const path = require('path');

exports.writeFileToDesktop = image => {
  try {
    const homedir = require('os').homedir();

    const outFile = `map-image.jpeg`;
    const outPath = path.join(`${homedir}/Desktop`, outFile);
    const file = fs.createWriteStream(outPath);

    file.on('finish', () => {
      console.log('finished');
      //res.send({ message: 'completed writing image' });
    });

    file.on('error', err => {
      console.log('error writing file');
      console.log(err);
    });

    file.write(image);
    file.end();
  } catch (err) {
    console.log(err);
    //res.send({ message: 'failed writing image' });
  }
};
