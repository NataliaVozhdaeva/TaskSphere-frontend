import React from "react";
import { render, screen } from '@testing-library/react';
import App from "./App";

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
  api: {
    defaults: {
      headers: {
        common: {}
      }
    }
  }
}));

describe("App Component", () => {
  test("renders without crashing", () => {
    render(<App />);
    expect(screen.getByText("TaskSphere")).toBeInTheDocument();
  });

  test("renders login form when not authenticated", () => {
    render(<App />);
    expect(screen.getByText("Your task management application")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });
});
