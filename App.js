// Purpose:
// This code creates a React frontend:

// Task Input: Provides an input field to add new tasks.
// Handle Task Submission: Sends the new task to the Flask backend to be added to the list.
// Display Tasks: Displays the list of tasks and updates in real-time as new tasks are added.


import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

function App() {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await axios.get('http://localhost:5000/tasks');
            setTasks(response.data);
        };
        fetchTasks();

        socket.on('all_tasks', (tasks) => {
            setTasks(tasks);
        });

        socket.on('task_added', (task) => {
            setTasks((prevTasks) => [...prevTasks, task]);
        });

        return () => {
            socket.off('all_tasks');
            socket.off('task_added');
        };
    }, []);

    const handleTaskChange = (e) => {
        setTask(e.target.value);
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (task) {
            try {
                const response = await axios.post('http://localhost:5000/tasks', { task });
                setTask('');
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    return (
        <div className="App">
            <h1>Real-Time Collaborative To-Do List</h1>
            <form onSubmit={handleAddTask}>
                <input
                    type="text"
                    value={task}
                    onChange={handleTaskChange}
                    placeholder="Add a new task"
                />
                <button type="submit">Add Task</button>
            </form>
            <ul>
                {tasks.map((task, index) => (
                    <li key={index}>{task}</li>
                ))}
            </ul>
        </div>
    );
}

export default App;
