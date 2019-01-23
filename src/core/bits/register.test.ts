import { DescBit } from ".";
import { NameBit } from ".";
import { RunBit } from ".";

const mockedSuru: any = {
  register: () => mockedSuru,
  registerBit: jest.fn(() => mockedSuru)
};

jest.mock("..", () => {
  return {
    Suru: mockedSuru
  };
});

it("should do what I need", () => {
  mockedSuru.registerBit.mockClear();

  require("./register");

  expect(mockedSuru.registerBit).toHaveBeenCalledTimes(3);

  expect(mockedSuru.registerBit).toHaveBeenNthCalledWith(1, "desc", DescBit);
  expect(mockedSuru.registerBit).toHaveBeenNthCalledWith(2, "name", NameBit);
  expect(mockedSuru.registerBit).toHaveBeenNthCalledWith(3, "run", RunBit);
});
