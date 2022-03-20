import { execSync } from "child_process";
import fs from "fs";

describe("cli", () => {
  test("Temp file for sample1 is created.", async () => {
    execSync("./lib/cli.js ./samples/sample1.tsx");
    expect(fs.readFileSync("./samples/sample1.tsx.tmp.tsx")).toBeTruthy();
  });

  test("Temp file for sample1 is equal to expected.", async () => {
    const tmp = fs.readFileSync("./samples/sample1.tsx.tmp.tsx");
    const expected = fs.readFileSync("./samples/sample1.expected.tsx");
    expect(tmp).toEqual(expected);

    if (tmp.toString() === expected.toString()) {
      fs.unlinkSync("./samples/sample1.tsx.tmp.tsx");
    }
  });
});
