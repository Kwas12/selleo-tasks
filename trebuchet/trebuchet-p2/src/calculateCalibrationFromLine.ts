import transformTextToNumber from "./transformTextToNumber";

function calculateCalibrationFromLine({ line }: { line: string }) {
  let firstNumber: number | null = null;
  let secondNumber: number | null = null;

  for (let i = 0; i < line.length; i++) {
    const candidateToNumber =
      Number(line[i]) || transformTextToNumber({ line, i });

    if (Number.isInteger(candidateToNumber)) {
      if (firstNumber == null) {
        firstNumber = candidateToNumber;
      }
      secondNumber = candidateToNumber;
    }
  }
  return Number(`${firstNumber}${secondNumber}`);
}

export default calculateCalibrationFromLine;
