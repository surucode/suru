import { Suru, SuruBit, Task } from "../..";

export const DescBit: SuruBit = (desc: string) => (t: Task) => {
  t.desc = desc;
};
