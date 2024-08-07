import { runReactSniffer } from "./reactsniffer";
import { processFiles } from "./utils/file-reader";

const pathToDir = process.argv[2];

if(!pathToDir) {
  console.error("Please provide a directory path as an argument.");
  process.exit(1);
}

const analyze = async (pathToDir: string) => 
  await runReactSniffer(pathToDir)
    .then((output) => {
      console.log(output.table1)
      console.log(output.table2)
    })
    .catch((error) => console.error(error))
    .then(() => 
      processFiles(pathToDir)
        .then((output) => console.log(output))
        .catch((error) => console.error(error))
    );

analyze(pathToDir);