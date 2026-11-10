package com.example.tasks.service;

public class TaskNotFoundException extends RuntimeException {

    public TaskNotFoundException(Long id) {
        super("Task not found: " + id);
    }
}
