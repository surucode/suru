import { SuruBit, Task } from "..";

type DescBitDSL = (desc: string) => void;

const DescBit: SuruBit = (t: Task): DescBitDSL => (desc: string) => {
  t.desc = desc;
};

DescBit.dsl = "desc";

export default DescBit;

declare global {
  export interface DSL {
    desc: DescBitDSL;
  }
}
