import { NameBit } from "./NameBit";
import { Task } from "..";

test("Add name to a task", () => {
  const task = new Task();

  const name = "testname";

  expect(task.name).not.toEqual(name);

  NameBit(task)(name);

  expect(task.name).toEqual(name);
});

test("Add name to a packaged task", () => {
    const task = new Task();
    task.package = "::testpkg::"

    const name = "testname";

    expect(task.name).not.toEqual(name);

    NameBit(task)(name);

    expect(task.name).toEqual(`testpkg::${name}`);
});
