import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import { tasksAPI, authAPI, api } from "./api";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [showLogin, setShowLogin] = useState(true);

  // Configure axios with token if available
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Token ${token}`;
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tasksAPI.getTasks();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(
        `Failed to fetch tasks (${err.response?.status}). Make sure the backend server is running on http://localhost:8000`,
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, fetchTasks]);

  const deleteTask = async (id) => {
    try {
      await tasksAPI.deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError("Failed to delete task");
      console.error("Error deleting task:", err);
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const updatedTask = await tasksAPI.patchTask(id, { status });
      setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    } catch (err) {
      setError("Failed to update task");
      console.error("Error updating task:", err);
    }
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await authAPI.login({ username, password });
      const token = response.token;

      // Set token in localStorage and state
      localStorage.setItem("token", token);
      setToken(token);

      // Set axios header immediately
      api.defaults.headers.common["Authorization"] = `Token ${token}`;

      setError(null);

      // Small delay to ensure everything is set up
      setTimeout(() => {
        setIsAuthenticated(true);
      }, 100);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (userData) => {
    try {
      await authAPI.register(userData);
      // After registration, login the user
      await handleLogin(userData.username, userData.password);
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error("Registration error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setIsAuthenticated(false);
    setTasks([]);
    // Remove axios authorization header
    delete api.defaults.headers.common["Authorization"];
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>TaskSphere</h1>
        <p>Your task management application</p>

        {error && (
          <div
            style={{
              backgroundColor: "#ff6b6b",
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
            }}
          >
            {error}
          </div>
        )}

        {!isAuthenticated ? (
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <div style={{ marginBottom: "20px" }}>
              <button
                onClick={() => setShowLogin(!showLogin)}
                style={{ padding: "10px 20px", marginRight: "10px" }}
              >
                {showLogin ? "Switch to Register" : "Switch to Login"}
              </button>
            </div>

            {showLogin ? (
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  padding: "20px",
                  borderRadius: "5px",
                }}
              >
                <h3>Login</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const username = e.target.username.value;
                    const password = e.target.password.value;
                    handleLogin(username, password);
                  }}
                >
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    style={{
                      display: "block",
                      width: "100%",
                      margin: "10px 0",
                      padding: "10px",
                      borderRadius: "3px",
                      border: "none",
                    }}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    style={{
                      display: "block",
                      width: "100%",
                      margin: "10px 0",
                      padding: "10px",
                      borderRadius: "3px",
                      border: "none",
                    }}
                  />
                  <button
                    type="submit"
                    style={{ padding: "10px 20px", width: "100%" }}
                  >
                    Login
                  </button>
                </form>
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.1)",
                  padding: "20px",
                  borderRadius: "5px",
                }}
              >
                <h3>Register</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const userData = {
                      username: e.target.username.value,
                      email: e.target.email.value,
                      password: e.target.password.value,
                      password_confirm: e.target.password_confirm.value,
                    };
                    handleRegister(userData);
                  }}
                >
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    required
                    style={{
                      display: "block",
                      width: "100%",
                      margin: "10px 0",
                      padding: "10px",
                      borderRadius: "3px",
                      border: "none",
                    }}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    style={{
                      display: "block",
                      width: "100%",
                      margin: "10px 0",
                      padding: "10px",
                      borderRadius: "3px",
                      border: "none",
                    }}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    style={{
                      display: "block",
                      width: "100%",
                      margin: "10px 0",
                      padding: "10px",
                      borderRadius: "3px",
                      border: "none",
                    }}
                  />
                  <input
                    type="password"
                    name="password_confirm"
                    placeholder="Confirm Password"
                    required
                    style={{
                      display: "block",
                      width: "100%",
                      margin: "10px 0",
                      padding: "10px",
                      borderRadius: "3px",
                      border: "none",
                    }}
                  />
                  <button
                    type="submit"
                    style={{ padding: "10px 20px", width: "100%" }}
                  >
                    Register
                  </button>
                </form>
              </div>
            )}
          </div>
        ) : (
          <div style={{ width: "100%", maxWidth: "800px", margin: "20px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2>Tasks ({tasks.length})</h2>
              <button
                onClick={handleLogout}
                style={{ padding: "10px 20px", backgroundColor: "#ff6b6b" }}
              >
                Logout
              </button>
            </div>
            {loading ? (
              <p>Loading tasks...</p>
            ) : (
              <>
                {tasks.length === 0 ? (
                  <p>No tasks found. Create your first task!</p>
                ) : (
                  <div style={{ textAlign: "left" }}>
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        style={{
                          backgroundColor: "rgba(255,255,255,0.1)",
                          padding: "15px",
                          margin: "10px 0",
                          borderRadius: "5px",
                          border: "1px solid rgba(255,255,255,0.2)",
                        }}
                      >
                        <h3>{task.title}</h3>
                        <p>{task.description}</p>
                        <p>
                          <strong>Status:</strong> {task.status}
                        </p>
                        <div style={{ marginTop: "10px" }}>
                          <button
                            onClick={() =>
                              updateTaskStatus(task.id, "completed")
                            }
                            style={{ marginRight: "10px", padding: "5px 10px" }}
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#ff6b6b",
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ marginTop: "20px" }}>
                  <button onClick={fetchTasks} style={{ padding: "10px 20px" }}>
                    Refresh Tasks
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
