import { Task } from "..";

type SuruBitDSL = (...args: any[]) => void;

type SuruBitConstructor = (t: Task) => SuruBitDSL;

type SuruBitProperties = { dsl: string };

export type SuruBit = SuruBitConstructor & SuruBitProperties;
