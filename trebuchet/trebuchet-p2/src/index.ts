import fs from "fs";
import readline from "readline";
import calculateCalibrationFromLine from "./calculateCalibrationFromLine";

async function calculateDirectorySum() {
  let sum = 0;

  const fileStream = fs.createReadStream("input.txt");

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    sum += calculateCalibrationFromLine({ line });
  }

  console.log(sum);
}

calculateDirectorySum();
