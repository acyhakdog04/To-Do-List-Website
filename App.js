import React, { useState, useEffect } from "react";
import "./App.css";

const ToDoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  const [deletedTasks, setDeletedTasks] = useState(() => {
    const storedDeletedTasks = localStorage.getItem("deletedTasks");
    return storedDeletedTasks ? JSON.parse(storedDeletedTasks) : [];
  });

  const [task, setTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedDeleted, setSelectedDeleted] = useState([]);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
  }, [deletedTasks]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask("");
    }
  };

  const toggleComplete = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  };

  const deleteTask = (index) => {
    const taskToDelete = tasks[index];
    setDeletedTasks([...deletedTasks, taskToDelete]);
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const restoreTask = (index) => {
    const taskToRestore = deletedTasks[index];
    setTasks([...tasks, taskToRestore]);
    setDeletedTasks(deletedTasks.filter((_, i) => i !== index));
  };

  const toggleSelectDeleted = (index) => {
    setSelectedDeleted((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const deleteSelectedTasks = () => {
    setDeletedTasks(deletedTasks.filter((_, i) => !selectedDeleted.includes(i)));
    setSelectedDeleted([]);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">✅ To-Do List</h1>

        <div className="relative">
          <button
            className="bg-gray-500 text-white p-2 rounded"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            ⋯
          </button>
          {showFilterMenu && (
            <div className="absolute right-0 mt-2 bg-white shadow-lg rounded w-auto p-2 flex space-x-2">
              <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setFilter("all")}>
                📋 All
              </button>
              <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => setFilter("completed")}>
                ✅ Completed
              </button>
              <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => setFilter("incomplete")}>
                ⏳ Incomplete
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setFilter("deleted")}>
                🗑 Deleted
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          className="border p-2 flex-grow"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="✍️ Enter a task..."
        />
        <button className="bg-blue-500 text-white p-2 ml-2" onClick={addTask}>
          ➕
        </button>
      </div>

      {/* Active Task List */}
      {filter !== "deleted" && (
        <ul>
          {filteredTasks.map((t, index) => (
            <li key={index} className="flex justify-between items-center p-2 border-b">
              <span className={`flex-grow ${t.completed ? "line-through text-gray-500" : ""}`}>{t.text}</span>
              <div>
                <button className={`p-1 mx-1 ${t.completed ? "bg-yellow-500" : "bg-green-500"} text-white`} onClick={() => toggleComplete(index)}>
                  {t.completed ? "🔄" : "✅"}
                </button>
                <button className="bg-red-500 text-white p-1" onClick={() => deleteTask(index)}>
                  ❌
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Deleted Task List */}
      {filter === "deleted" && (
        <>
          <ul>
            {deletedTasks.map((t, index) => (
              <li key={index} className="flex items-center justify-between p-2 border-b text-gray-500">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    onChange={() => toggleSelectDeleted(index)}
                    checked={selectedDeleted.includes(index)}
                    className="w-5 h-5"
                  />
                  <span>{t.text}</span>
                </div>
                <button className="bg-blue-500 text-white p-1" onClick={() => restoreTask(index)}>
                  🔄 Restore
                </button>
              </li>
            ))}
          </ul>

          {/* Delete Selected Button */}
          {selectedDeleted.length > 0 && (
            <button className="bg-red-600 text-white px-4 py-2 mt-4" onClick={deleteSelectedTasks}>
              🗑 Delete Selected
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ToDoApp;
