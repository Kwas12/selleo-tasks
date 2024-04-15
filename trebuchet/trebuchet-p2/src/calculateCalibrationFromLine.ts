import transformTextToNumber from "./transformTextToNumber";

function calculateCalibrationFromLine({ line }: { line: string }) {
  let firstNumber: number | null = null;
  let secondNumber: number | null = null;

  for (let i = 0; i < line.length; i++) {
    if (firstNumber == null) {
      const candidateToNumberFirst =
        Number(line[i]) || transformTextToNumber({ line, i });
      if (candidateToNumberFirst) {
        firstNumber = candidateToNumberFirst;
      }
    }

    if (secondNumber == null) {
      const candidateToNumberSecond =
        Number(line[line.length - 1 - i]) ||
        transformTextToNumber({ line, i: line.length - 1 - i });
      if (candidateToNumberSecond) {
        secondNumber = candidateToNumberSecond;
      }
    }

    if (firstNumber != null && secondNumber != null) {
      break;
    }
  }
  return Number(`${firstNumber}${secondNumber}`);
}

export default calculateCalibrationFromLine;
