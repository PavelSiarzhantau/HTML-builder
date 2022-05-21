const fs = require('fs');
const path = require('path');
const rl = require('readline');
const process = require('process');
const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});
let dataToAdd = '';

function createWriteStream() {
  return fs.createWriteStream(path.join(__dirname, 'test.txt'));
}
function sayBye() {
  readline.write('Have a nice day, Bye Bye!');
}
function sayHi(){
  readline.write('Hi, nice to meet you, please enter something:\n');
}
fs.access(path.join(__dirname, 'test.txt'), (error) => {
  if (error) createWriteStream();
  const readStream = fs.createReadStream(
    path.join(__dirname, 'test.txt'),
    'utf-8'
  );
  createMainLogic(readStream);
});

function createMainLogic(readStream) {
  sayHi();
  readStream.on('data', (chunk) => {
    dataToAdd += chunk;
  });
  readline.on('line', (data) => {
    if (data === 'exit') {
      sayBye();
      process.exit();
    }
    dataToAdd += data + '\n';
    const writeStream = createWriteStream();
    writeStream.write(dataToAdd);
  });
  readline.on('close', () => {
    sayBye();
    process.exit();
  });
}
