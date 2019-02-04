import { SuruBit, Task } from "..";

type NameBitDSL = (name: string) => void;

const NameBit: SuruBit = (t: Task): NameBitDSL => (name: string) => {
  t.name = `${t.package.replace(/^::/, "")}${name}`;
};

NameBit.dsl = "name";

export default NameBit;

declare global {
  export interface DSL {
    name: NameBitDSL;
  }
}
