import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsCircleFill } from "react-icons/bs";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";

function Home() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    axios
      .get("http://localhost:3000/get")
      .then((result) => setTodos(result.data))
      .catch((err) => console.log(err));
  };

  const handleAdd = () => {
    if (!task.trim()) return;

    axios
      .post("http://localhost:3000/add", { task })
      .then((res) => {
        setTodos((prevTodos) => [...prevTodos, res.data]);
        setTask("");
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (id, newTask) => {
    if (!newTask.trim()) return; // ✅ Prevent empty updates

    axios
      .put(`http://localhost:3000/update/${id}`, { task: newTask }) // ✅ Send updated task to backend
      .then(() => {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo._id === id ? { ...todo, task: newTask } : todo
          )
        );
        setEditId(null); // ✅ Exit edit mode after update
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/delete/${id}`)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ marginLeft: "600px" }}>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          placeholder="Enter task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()} // Listen for Enter key
        />
        <button type="button" style={{ backgroundColor: "green", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer" }} onClick={handleAdd}>
          Add
        </button>
      </div>

      {todos.length === 0 ? (
        <div>
          <h3>No records</h3>
        </div>
      ) : (
        todos.map((todo) => (
          <div key={todo._id} className="task">
            {editId === todo._id ? (
              <input
                type="text"
                value={editTask}
                onChange={(e) => setEditTask(e.target.value)}
                onBlur={() => handleEdit(todo._id, editTask)} // ✅ Save on blur
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEdit(todo._id, editTask); // ✅ Save on Enter
                }}
                autoFocus
              />
            ) : (
              <div className="checkbox">
                <BsCircleFill className="icon" style={{ marginRight: "8px" }} />
                {todo.task}
              </div>
            )}

            <div>
              <span
                onClick={() => {
                  setEditId(todo._id);
                  setEditTask(todo.task);
                }}
                style={{ cursor: "pointer", color: "blue", marginRight: "10px" }}
              >
                <AiFillEdit className="icon" />
              </span>
              <span
                onClick={() => handleDelete(todo._id)}
                style={{ cursor: "pointer", color: "red" }}
              >
                <AiFillDelete className="icon" />
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
