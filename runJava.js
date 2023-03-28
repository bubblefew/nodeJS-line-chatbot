const { exec } = require("child_process");

const jarPath = "D:/java_project/JavaApplication2/dist/JavaApplication2.jar";

exec(`java -jar ${jarPath}`, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});