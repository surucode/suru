import { Suru } from "../core";
import { ShellBit } from "./bit/ShellBit";
import { ShellBitRunArgsPosition } from "./utils";

const suru = Suru.registerBit("shell", ShellBit);
(<any>suru.bits.shell).args = ShellBitRunArgsPosition;
