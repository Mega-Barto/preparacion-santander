package com.example.tasks.service;

import com.example.tasks.model.Task;
import com.example.tasks.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TaskService {

    private final TaskRepository tasks;

    public TaskService(TaskRepository tasks) {
        this.tasks = tasks;
    }

    public List<Task> findAll() {
        return tasks.findAllByOrderByCreatedAtDesc();
    }

    public Task findById(Long id) {
        return tasks.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
    }

    @Transactional
    public Task create(Task input) {
        Task task = new Task();
        task.setTitle(input.getTitle());
        task.setDescription(input.getDescription());
        task.setStatus(input.getStatus() == null || input.getStatus().isBlank() ? "pending" : input.getStatus());
        return tasks.save(task);
    }

    @Transactional
    public Task update(Long id, Task input) {
        Task current = findById(id);
        current.setTitle(input.getTitle());
        current.setDescription(input.getDescription());
        current.setStatus(input.getStatus());
        return tasks.save(current);
    }

    @Transactional
    public void delete(Long id) {
        tasks.delete(findById(id));
    }
}
