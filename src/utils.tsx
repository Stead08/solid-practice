import { createEffect, createRoot } from "solid-js";
import { createStore, type SetStoreFunction, type Store } from "solid-js/store";

export function createLocalStore<T extends object>(
  name: string,
  init: T
): [Store<T>, SetStoreFunction<T>] {
  const localState = localStorage.getItem(name);
  const [state, setState] = createStore<T>(localState ? JSON.parse(localState) : init);
  createEffect(() => {
    localStorage.setItem(name, JSON.stringify(state));
  });
  return [state, setState];
}

export function removeIndex<T>(array: readonly T[], index: number): T[] {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

// Testing
if (import.meta.vitest) {
  const { it, expect, beforeEach, describe } = import.meta.vitest;
  describe("createLocalStorage", () => {
    beforeEach(() => {
      localStorage.clear();
    });
    const initialState = {
      todos: [],
      newTitle: ""
    };

    it("reads pre-existing state from localStorage", () => {
      createRoot(dispose => {
        const savedState = {
          todos: [{ title: "learn Solid" }],
          newTitle: "learn Solid"
        };

        localStorage.setItem("state", JSON.stringify(savedState));
        const [state] = createLocalStore("state", initialState);

        expect(state).toEqual(savedState);
        dispose();
      });
    });
    it("stores new state to localStorage", () => {
      void createRoot(async dispose => {
        const [, setState] = createLocalStore("state", initialState);
        setState("newTitle", "updated");
        return await new Promise(resolve => {
          createEffect(() => {
            expect(JSON.parse(localStorage.getItem("state") ?? "")).toEqual({
              todos: [],
              newTitle: "updated"
            });
            dispose();
            resolve(0);
          });
        });
      });
    });
    it("update state multiple times", async () => {
      const { dispose, setState } = createRoot(dispose => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [_state, setState] = createLocalStore("state", initialState);
        return { dispose, setState };
      });

      setState("newTitle", "first");
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(JSON.parse(localStorage.getItem("state") ?? "")).toEqual({
        todos: [],
        newTitle: "first"
      });

      setState("newTitle", "second");
      await new Promise(resolve => setTimeout(resolve, 0));
      expect(JSON.parse(localStorage.getItem("state") ?? "")).toEqual({
        todos: [],
        newTitle: "second"
      });
      dispose();
    });
  });
}
