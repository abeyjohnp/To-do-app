import { useState } from "react";

function App()
{
  const [todos,setTodos] = useState([
    {
      id:1,
      title: "Learn React",
      completed : false
    },
    {
      id:2,
      title: "Learn Prisma",
      completed : false
    }

  ])
  const [input, setInput] = useState("")
  function handleAddTodo()
  {
    if (input.trim() === "") return;

    const newToDo = {
      id : Date.now(),
      title : input.trim(),
      completed : false
    };

    setTodos([...todos,newToDo]);
    setInput("");
  }

  function handleToggleTodo(id)
  {
    const updatedTodos =  todos.map((todo) => {
      if (todo.id === id )
      {
        
        return {...todo, completed : !todo.completed}
        
      }
      return todo
    })

    setTodos(updatedTodos)
  }

  return(
    <div>
      <h1>My Tasks!</h1>
      <div>
        <input 
          type = "text"
          placeholder = "Type a task"
          value = {input}
          onChange = {(e) => setInput(e.target.value)}>
        </input>
        <button onClick = {handleAddTodo}>Add</button>
      </div>
      <ul>
        {
          todos.map((todo) => (
            <li key={todo.id}>
              {todo.title}
              <input
                type="checkbox"
                checked = {todo.completed}
                onChange = {() => handleToggleTodo(todo.id)}
              >
              </input>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default App