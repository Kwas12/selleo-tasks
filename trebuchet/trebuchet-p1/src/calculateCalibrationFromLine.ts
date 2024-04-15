import fs from "fs";
import readline from "readline";

function calculateCalibrationFromLine({ line }: { line: string }) {
  let firstNumber = null;
  let secondNumber = null;

  for (const char of line) {
    const candidateToNumber = Number(char);
    if (candidateToNumber) {
      if (firstNumber == null) {
        firstNumber = candidateToNumber;
      }
      secondNumber = candidateToNumber;
    }
  }
  return Number(`${firstNumber}${secondNumber}`);
}

export default calculateCalibrationFromLine;
