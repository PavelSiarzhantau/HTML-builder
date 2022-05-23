const fs = require('fs');
const path = require('path');

fs.readdir(
  path.join(__dirname, 'styles'),
  { withFileTypes: true },
  (err, files) => {
    if (err) {
      console.log('Error:', err);
    } else {
      files.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === '.css') {
          let dataFromFile = '';
          const readFile = fs.createReadStream(
            path.join(__dirname, `styles/${file.name}`),
            'utf-8'
          );
          readFile.on('data', (chunk) => {
            dataFromFile += chunk;
          });

          readFile.on('end', () => {
            fs.writeFile(path.join(__dirname, 'project-dist/bundle.css'),'',err=>{
              if(err) console.error('Error',err.message);
            });
            fs.appendFile(path.join(__dirname, 'project-dist/bundle.css'),dataFromFile, err=>{
              if(err) console.error('Error', err.message);
            });
            console.log(`${file.name} was successfully merged`);
          });
        }
      });
    }
  }
);
