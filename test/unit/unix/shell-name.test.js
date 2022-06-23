/**
 * @overview Contains unit tests for the getting a shell's name on Unix systems.
 * @license Unlicense
 */

import test from "ava";
import sinon from "sinon";

import { constants } from "./_.js";

import { getShellName } from "../../../src/unix.js";

test.beforeEach((t) => {
  const resolveExecutable = sinon.stub();
  resolveExecutable.returns("foobar");

  t.context.deps = { resolveExecutable };
});

test("the value being resolved", (t) => {
  const shell = "foobar";

  getShellName({ shell }, t.context.deps);
  t.true(
    t.context.deps.resolveExecutable.calledWithExactly(
      { executable: shell },
      sinon.match.any
    )
  );
});

for (const shell of constants.shellsUnix) {
  test(`the supported shell ${shell}`, (t) => {
    t.context.deps.resolveExecutable.returns(`/bin/${shell}`);

    const result = getShellName({ shell }, t.context.deps);
    t.is(result, shell);
  });
}

test("the fallback for unsupported shells", (t) => {
  const shell = "foobar";

  t.context.deps.resolveExecutable.returns(`/bin/${shell}`);

  const result = getShellName({ shell }, t.context.deps);
  t.is(result, constants.binBash);
});

test("the helpers provided to `resolveExecutable`", (t) => {
  const shell = "foobar";

  getShellName({ shell }, t.context.deps);
  t.true(
    t.context.deps.resolveExecutable.calledWithExactly(sinon.match.any, {
      exists: sinon.match.func,
      readlink: sinon.match.func,
      which: sinon.match.func,
    })
  );
});