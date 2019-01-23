import { DescBit } from "./DescBit";
import { Task } from "../..";

test("Add desc to a task", () => {
    const task = new Task();

    const description = "test description";

    expect(task.desc).not.toEqual(description);

    DescBit(description)(task);
   
    expect(task.desc).toEqual(description);
})