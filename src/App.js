import React, { useEffect, useState } from "react";
import ToDoList from "./Todo/ToDoList";
import Context from "./context";
import Loader from "./Loader";

const AddTodo = React.lazy(
  () => 
  new Promise(resolve => {
    setTimeout(() => {
      resolve(import("./Todo/AddTodo"));
    }, 3000);
  })
)

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true); // [variable, function]

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos?_limit=5")
      .then((response) => response.json())
      .then((todos) => {
        setTimeout(() => {
          setTodos(todos);
          setLoading(false);
        }, 2000);
      });
  }, []);

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          todo.completed = !todo.completed;
        }
        return todo;
      })
    );
  }

  function removeTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function addTodo(title) {
    setTodos(
      todos.concat([
        {
          title,
          id: Date.now(),
          completed: false,
        },
      ])
    );
  }
 
  return (
    <Context.Provider value={{removeTodo}}>
      <div className="main-div">
        <h1>ToDo List:</h1>
        <React.Suspense fallback = {<p>Loading...</p>}>
        <AddTodo onCreate={addTodo} />
        </React.Suspense>
        
        {loading && <Loader />}
        {todos.length ? (
          <ToDoList todos={todos} onToggle={toggleTodo} />
        ) : loading ? null : (
          <p>No Todos</p>
        )}
      </div>
    </Context.Provider>
  );
}

export default App;
