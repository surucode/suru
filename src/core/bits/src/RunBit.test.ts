import { RunBit } from "./RunBit";
import { Task } from "../..";

test("Add runFn to a task", () => {
  const task = new Task();

  const runFnSpy = jest.fn();

  RunBit(runFnSpy)(task);

  task.run("test", "args");

  expect(runFnSpy).toHaveBeenCalled();
  expect(runFnSpy).toHaveBeenCalledWith("test", "args");
});

test("Add multiple runFn to a task", () => {
  const task = new Task();

  const runFnSpy = jest.fn();

  RunBit(runFnSpy)(task);

  const first_args = ["test", "args"];

  task.run(...first_args);

  expect(runFnSpy).toHaveBeenCalledTimes(1);
  expect(runFnSpy).toHaveBeenNthCalledWith(1, ...first_args);

  const runFnSpy2 = jest.fn();

  RunBit(runFnSpy2)(task);

  const second_args = ["test", "args", "second time"];

  task.run(...second_args);

  expect(runFnSpy).toHaveBeenCalledTimes(2);
  expect(runFnSpy).toHaveBeenNthCalledWith(2, ...second_args);

  expect(runFnSpy2).toHaveBeenCalledTimes(1);
  expect(runFnSpy2).toHaveBeenNthCalledWith(1, ...second_args);
});
