import { Suru } from "..";

import { DescBit } from ".";
import { NameBit } from ".";
import { RunBit } from ".";

void Suru.register()
.registerBit("desc", DescBit)
.registerBit("name", NameBit)
.registerBit("run", RunBit);

declare global {
  namespace NodeJS {
    export interface Global {
      name(name: string): void;
      desc(desc: string): void;
      run(runFn: Function): void;
    }
  }
}
