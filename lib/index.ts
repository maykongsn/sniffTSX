import { analyze } from "./analyzer";
import { runReactSniffer } from "./reactsniffer";

const pathToDir = process.argv[2];

if(!pathToDir) {
  console.error("Please provide a directory path as an argument.");
  process.exit(1);
}

const run = async (pathToDir: string) => 
  await runReactSniffer(pathToDir)
    .then((output) => {
      console.log(output.table1)
      console.log(output.table2)
    })
    .catch((error) => console.error(error))
    .then(() => 
      analyze(pathToDir)
    );

run(pathToDir);