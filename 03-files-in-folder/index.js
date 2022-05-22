const path = require('path');
const fs = require('fs');

// Function to get current filenames
// in directory
fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      console.log('\nCurrent directory filenames:');
      files.forEach((file) => {
        if(file.isFile()){
          fs.stat(
            path.join(__dirname, 'secret-folder/' + file.name),
            (error, stats) => {
              if (error) console.log(error);
              console.log(`${path.parse(file.name).name} - ${path.extname(file.name).replace('.', '')} - ${stats.size / 1000}kb`);
            }
          );
        }
      });
    }
  }
);
