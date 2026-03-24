import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { tasksAPI, authAPI } from "./api";

// Mock the API modules
jest.mock("./api", () => ({
  tasksAPI: {
    getTasks: jest.fn(),
    createTask: jest.fn(),
    deleteTask: jest.fn(),
    patchTask: jest.fn(),
  },
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  },
}));

describe("App Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders login form when not authenticated", () => {
    render(<App />);

    expect(screen.getByText("TaskSphere")).toBeInTheDocument();
    expect(
      screen.getByText("Your task management application"),
    ).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  test("can switch between login and register forms", () => {
    render(<App />);

    const switchButton = screen.getByText("Switch to Register");
    fireEvent.click(switchButton);

    expect(screen.getByText("Register")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Confirm Password")).toBeInTheDocument();
  });

  test("handles login successfully", async () => {
    const mockToken = "test-token-123";
    authAPI.login.mockResolvedValue({ token: mockToken });
    tasksAPI.getTasks.mockResolvedValue([]);

    render(<App />);

    const usernameInput = screen.getByPlaceholderText("Username");
    const passwordInput = screen.getByPlaceholderText("Password");
    const loginButton = screen.getByText("Login");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpass" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({
        username: "testuser",
        password: "testpass",
      });
    });
    
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe(mockToken);
    });
  });

  test("displays tasks when authenticated", async () => {
    const mockTasks = [
      {
        id: 1,
        title: "Test Task 1",
        description: "Description 1",
        status: "to_do",
      },
      {
        id: 2,
        title: "Test Task 2",
        description: "Description 2",
        status: "completed",
      },
    ];

    // Mock authenticated state
    localStorage.setItem("token", "test-token");
    tasksAPI.getTasks.mockResolvedValue(mockTasks);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Tasks (2)")).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText("Test Task 1")).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText("Test Task 2")).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText("Description 1")).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText("Description 2")).toBeInTheDocument();
    });
  });

  test("shows empty state when no tasks", async () => {
    localStorage.setItem("token", "test-token");
    tasksAPI.getTasks.mockResolvedValue([]);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Tasks (0)")).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(
        screen.getByText("No tasks found. Create your first task!"),
      ).toBeInTheDocument();
    });
  });
});
