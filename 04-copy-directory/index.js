const fs = require('fs');
const path = require('path');

function copyDir(){
  createDir();
  deleteAssets();
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
      console.error(err);
    }
    console.log('Directory created successfully!');
  });
}
function deleteAssets(){
  fs.readdir(path.join(__dirname, 'files-copy'),{withFileTypes:true}, (err, files)=>{
    if(err) console.error(err.message);
    files.forEach(file=>{
      if(file.isFile()){
        fs.unlink(path.join(__dirname, `files-copy/${file.name}`),(err)=>{
          if(err) console.log(err.message);
        });
      }
    });
  });
}
copyDir();
