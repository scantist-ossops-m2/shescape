/**
 * @overview Contains property tests for `./src/main.js`.
 * @license Unlicense
 * @author Eric Cornelissen <ericornelissen@gmail.com>
 */

import assert from "assert";
import * as fc from "fast-check";

import {
  unixEnv,
  unixPlatform,
  unixShells,
  winEnv,
  winPlatform,
  winShells,
} from "./common.js";

import {
  escapeShellArgByPlatform,
  quoteShellArgByPlatform,
} from "../src/main.js";
import * as unix from "../src/unix.js";
import * as win from "../src/win.js";

describe("main.js", function () {
  before(function () {
    fc.configureGlobal({
      numRuns: 10 ** 5,
      interruptAfterTimeLimit: 1900,
      markInterruptAsFailure: false,
    });
  });

  describe("::escapeShellArgByPlatform", function () {
    describe("unix", function () {
      const env = unixEnv;
      const platform = unixPlatform;
      const defaultShell = unix.getDefaultShell();

      it("calls the unix escape function when given a string", function () {
        fc.assert(
          fc.property(
            fc.string(),
            fc.constantFrom(...unixShells),
            function (arg, shell) {
              const result = escapeShellArgByPlatform(
                arg,
                platform,
                env,
                shell
              );
              const expected = unix.escapeShellArg(arg, shell || defaultShell);
              assert.equal(result, expected);
            }
          )
        );
      });

      it("calls the unix escape function when given a number", function () {
        fc.assert(
          fc.property(
            fc.oneof(fc.integer(), fc.float(), fc.double()),
            fc.constantFrom(...unixShells),
            function (arg, shell) {
              const result = escapeShellArgByPlatform(
                arg,
                platform,
                env,
                shell
              );
              const expected = unix.escapeShellArg(
                `${arg}`,
                shell || defaultShell
              );
              assert.equal(result, expected);
            }
          )
        );
      });
    });

    describe("win32", function () {
      const env = winEnv;
      const platform = winPlatform;
      const defaultShell = win.getDefaultShell(env);

      it("calls the win escape function when given a string", function () {
        fc.assert(
          fc.property(
            fc.string(),
            fc.constantFrom(...winShells),
            function (arg, shell) {
              const result = escapeShellArgByPlatform(
                arg,
                platform,
                env,
                shell
              );
              const expected = win.escapeShellArg(arg, shell || defaultShell);
              assert.equal(result, expected);
            }
          )
        );
      });

      it("calls the win escape function when given a number", function () {
        fc.assert(
          fc.property(
            fc.oneof(fc.integer(), fc.float(), fc.double()),
            fc.constantFrom(...winShells),
            function (arg, shell) {
              const result = escapeShellArgByPlatform(
                arg,
                platform,
                env,
                shell
              );
              const expected = win.escapeShellArg(
                `${arg}`,
                shell || defaultShell
              );
              assert.equal(result, expected);
            }
          )
        );
      });
    });
  });

  describe("::quoteShellArgByPlatform", function () {
    describe("unix", function () {
      const env = unixEnv;
      const platform = unixPlatform;

      it("uses single quotes to quote the argument", function () {
        fc.assert(
          fc.property(
            fc.oneof(fc.string(), fc.integer(), fc.float(), fc.double()),
            fc.constantFrom(...unixShells),
            function (arg, shell) {
              const result = quoteShellArgByPlatform(arg, platform, env, shell);
              assert(result.startsWith("'"));
              assert(result.endsWith("'"));
            }
          )
        );
      });

      it("contains the escaped argument", function () {
        fc.assert(
          fc.property(
            fc.oneof(fc.string(), fc.integer(), fc.float(), fc.double()),
            fc.constantFrom(...unixShells),
            function (arg, shell) {
              const result = quoteShellArgByPlatform(arg, platform, env, shell);
              const escapedArg = escapeShellArgByPlatform(
                arg,
                platform,
                env,
                shell
              );
              assert.strictEqual(result.slice(1, -1), escapedArg);
            }
          )
        );
      });
    });

    describe("win32", function () {
      const env = winEnv;
      const platform = winPlatform;

      it("uses double quotes to quote the argument", function () {
        fc.assert(
          fc.property(
            fc.oneof(fc.string(), fc.integer(), fc.float(), fc.double()),
            fc.constantFrom(...winShells),
            function (arg, shell) {
              const result = quoteShellArgByPlatform(arg, platform, env, shell);
              assert(result.startsWith('"'));
              assert(result.endsWith('"'));
            }
          )
        );
      });

      it("contains the escaped argument", function () {
        fc.assert(
          fc.property(
            fc.oneof(fc.string(), fc.integer(), fc.float(), fc.double()),
            fc.constantFrom(...winShells),
            function (arg, shell) {
              const result = quoteShellArgByPlatform(arg, platform, env, shell);
              const escapedArg = escapeShellArgByPlatform(
                arg,
                platform,
                env,
                shell
              );
              assert.strictEqual(result.slice(1, -1), escapedArg);
            }
          )
        );
      });
    });
  });
});