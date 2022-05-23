const fs = require('fs');
const fsPromises = fs.promises;
const path = require('path');


//assets helper
let copyAssets = (dirname)=>{
  fs.mkdir(path.join(__dirname,'/project-dist/assets'),{recursive:true},(err)=>{
    if(err) return console.error(err);
  });
//   fs.readdir(path.join(__dirname,dirname),{withFileTypes:true},(err,files)=>{
//     files.forEach((file)=>{
//       if(! file.isDirectory){

//       }else{
//         fs.copyFile(path.join(__dirname,`/assets/${file.name}`),
//           path.join(__dirname,`/project-dist/${file.name}`),
//           fs.constants.COPYFILE_FICLONE,
//           (err)=>{
//             if(err) console.log('Error found: ', err);
//           });
//       }
//     });
//   });

};
//css helpers
fs.readdirAsyncCss = (dirname)=>{
  return new Promise((resolve,reject)=>{
    fs.readdir(dirname,{withFileTypes:true},(err,filenames)=>{
      if(err) reject(err);
      else resolve(filenames);
    });
  });
};
function isFileCss(file) {
  return path.extname(file.name) === '.css' && file.isFile();
}
function getFileCss(file) {
  let text = fsPromises.readFile(path.join(__dirname, `/styles/${file.name}`),'utf-8');
  return text.then(data=>{
    return [path.parse(file.name).name, data];
  });

}
//html helpers
let createDir = fsPromises.mkdir(path.join(__dirname,'project-dist'),{recursive:true});
fs.readdirAsync = (dirname) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, { withFileTypes: true }, (err, filenames) => {
      if (err) reject(err);
      else resolve(filenames);
    });
  });
};

function isFileHtml(file) {
  return path.extname(file.name) === '.html' && file.isFile();
}
function getFileHtml(file) {
  return [path.parse(file.name).name, fsPromises.readFile(path.join(__dirname, `/components/${file.name}`),'utf-8')];
  
}
function getTemplate(){
  return fsPromises.readFile(path.join(__dirname,'/template.html'),'utf-8');
}

function replace(mapFiles,file){
  let count = 0;
  let finalText='';
  for(let key of mapFiles.keys()){
    mapFiles.get(key).then((text)=>{
      file = file.replace(`{{${key}}}`,text);
      count++;
      if(count === mapFiles.size){
        return new Promise((res)=>{
          res(file);
        });
      }
    }).then(text => {
      if(text !== undefined){
        finalText = text;
        fs.writeFile(path.join(__dirname,'/project-dist/index.html'),finalText,(err)=>{
          if(err) console.error(err.message);
        });
      }
    });
  }
}

//main function
createDir.then(fs.readdirAsync(path.join(__dirname, '/components/'))
  //html
  .then((filenames) => {
    filenames = filenames.filter(isFileHtml);
    return Promise.all((filenames.map(getFileHtml)));
  })
  .then((files) => {
    getTemplate().then(file=>{
      let mapFiles = new Map(files);
      replace(mapFiles,file);  
    });
    return new Promise((res)=>res());
  //css
  }).then(()=>{
    fs.readdirAsyncCss(path.join(__dirname, '/styles/'))
      .then((filenames)=>{
        filenames = filenames.filter(isFileCss);
        return Promise.all(((filenames.map(getFileCss))));
      }).then(files=>{
        let mapCss= new Map(files);
        fs.writeFile(path.join(__dirname,'/project-dist/style.css'),'',err=>{if(err) console.error(err);});
        for(let i = 0; i< mapCss.size;i++){
          if(i === 0){
            fs.appendFile(path.join(__dirname,'/project-dist/style.css'),mapCss.get('header'),err=>{if(err) console.error(err);});
          }else if(i === 1){
            fs.appendFile(path.join(__dirname,'/project-dist/style.css'),mapCss.get('main'),err=>{if(err) console.error(err);});
          }else if(i===2){
            fs.appendFile(path.join(__dirname,'/project-dist/style.css'),mapCss.get('footer'),err=>{if(err) console.error(err);});
          }
        }
        return new Promise(res=>res());
      }).then(()=>{
        copyAssets('assets');
      });
  }));





