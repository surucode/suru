import { SuruBit, Task } from "../..";

type TaskRunFn = (...args: any[]) => any;

export const RunBit: SuruBit = (runFn: TaskRunFn) => (t: Task) => {
  t.runFns.push(runFn);
};
