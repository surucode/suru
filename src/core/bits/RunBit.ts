import { SuruBit, Task } from "..";

type TaskRunFn = (...args: any[]) => any;
type RunBitDSL = (runFn: TaskRunFn) => void;

const RunBit: SuruBit = (t: Task): RunBitDSL => (runFn: TaskRunFn) => {
  t.runFns.push(runFn);
};

RunBit.dsl = "run";

export default RunBit;

declare global {
  export interface DSL {
    run: RunBitDSL;
  }
}
