function transformTextToNumber({ line, i }: { line: string; i: number }) {
  const with3 = line.slice(i, i + 3);
  if (with3 === "one") {
    return 1;
  }
  if (with3 === "two") {
    return 2;
  }
  if (with3 === "six") {
    return 6;
  }

  const with4 = line.slice(i, i + 4);
  if (with4 === "four") {
    return 4;
  }
  if (with4 === "five") {
    return 5;
  }
  if (with4 === "nine") {
    return 9;
  }

  const with5 = line.slice(i, i + 5);
  if (with5 === "three") {
    return 3;
  }
  if (with5 === "seven") {
    return 7;
  }
  if (with5 === "eight") {
    return 8;
  }

  return null;
}

export default transformTextToNumber;
