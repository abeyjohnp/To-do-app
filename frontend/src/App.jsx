import { useState , useEffect } from "react";
import "./App.css"
function App()
{
  const [todos,setTodos] = useState([])
  const [input, setInput] = useState("")

  useEffect(()=>{
    async function loadTodos()
    {
      try{
        const response = await fetch("http://localhost:3000/api/todos");
        const data  = await response.json()

        setTodos (data.todos)

      }
      catch(error)
      {
        console.error("Error loading todos from backend : ",error);
      }
    }
    loadTodos();
  },[])



  async function handleAddTodo()
  {
    if (input.trim() === "") return;

    try 
    {
      const response = await fetch("http://localhost:3000/api/todos",{
        method : "POST",
        headers : 
        {
          "Content-type" : "application/json"
        },
        body : JSON.stringify({title: input.trim()})
      })

      const newToDoFromDatabase = await response.json()

      setTodos([...todos,newToDoFromDatabase])
      setInput("")
    }
    catch(error)
    {
      console.error(error)
    }
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

  function handleDeleteTodo(id)
  {
    const filteredTodos = todos.filter((todo) => 
      todo.id !== id
    )
    setTodos(filteredTodos);
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
              <span style = {{color : todo.completed ? "grey" : "black" }}>
              {todo.title}
              </span>
              <input
                type="checkbox"
                checked = {todo.completed}
                onChange = {() => handleToggleTodo(todo.id)}
              />
              <button onClick = {()=> handleDeleteTodo(todo.id)}>
                Delete
              </button>
              
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default App