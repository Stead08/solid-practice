import { batch, createSignal, For } from "solid-js";
import "./App.scss";
import { createLocalStore, removeIndex } from "./utils.tsx";

interface TodoItem {
  title: string;
  done: boolean;
}
function App() {
  const [newTitle, setTitle] = createSignal("");
  const [todos, setTodos] = createLocalStore<TodoItem[]>("todos", []);
  const addTodo = (e: SubmitEvent) => {
    e.preventDefault();
    batch(() => {
      setTodos(todos.length, {
        title: newTitle(),
        done: false
      });
      setTitle("");
    });
  };

  const removeTodo = (i: number) => {
    setTodos(todos => removeIndex(todos, i));
  };
  return (
    <>
      <h3>Simple Todos Example</h3>
      <form onSubmit={addTodo}>
        <input
          placeholder="enter todo and click +"
          required
          value={newTitle()}
          onInput={e => setTitle(e.currentTarget.value)}
        />
        <button>+</button>
      </form>
      <For each={todos}>
        {(todo, i) => (
          <div>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={e => {
                setTodos(i(), "done", e.currentTarget.checked);
              }}
            />
            <input
              type="text"
              value={todo.title}
              onChange={e => {
                setTodos(i(), "title", e.currentTarget.value);
              }}
            />
            <button
              onClick={() => {
                removeTodo(i());
              }}
            >
              x
            </button>
          </div>
        )}
      </For>
    </>
  );
}

export default App;
