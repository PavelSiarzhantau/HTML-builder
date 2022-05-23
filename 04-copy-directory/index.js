const fs = require('fs');
const path = require('path');

function copyDir(){
  createDir();
  fs.readdir(
    path.join(__dirname, 'files'),
    { withFileTypes: false },
    (err, files) => {
      files.forEach((file) => {
        fs.copyFile(
          path.join(__dirname, `/files/${file}`),
          path.join(__dirname, `/files-copy/${file}`),
          fs.constants.COPYFILE_FICLONE,
          (err) => {
            if (err) console.log('Error found: ', err);
          }
        );
        console.log(`${file} was successfully copied to folder 'files-copy'`);
      });
    }
  );
}
function createDir() {
  fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
    console.log('Directory created successfully!');
  });
}
copyDir();
