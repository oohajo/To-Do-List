window.onload = function(){
    console.log('Book list app started.');
    taskList.init();
};

class Task {
    constructor(title, details) {
        this.title = title;
        this.details = details;
        this.id = Date.now();
    }
};

class TaskList {
    constructor() {
        this.tasks = [];
    };

    init() {
        document.getElementById("addBtn").addEventListener('click', (e) => this.addButton(e));
        this.loadDataFromStorage();
    };

    loadDataFromStorage () {
        const data = storage.getTask();

        if (data === null || data === undefined) return;

        this.tasks = data;
        data.forEach( (task, i) => {
            userInterface.addTaskToList(task);
        })
    }

    addButton(e) {
        const title = document.getElementById("taskTitle").value;
        const details = document.getElementById("taskDetails").value;
        e.preventDefault();

        if (title == "" && details == "") {
            console.log("Task unknown.");
            return;
        };

        const task = new Task(title, details);
        this.addTask(task);

    };

    addTask(task) {
        this.tasks.push(task);
        userInterface.addTaskToList(task);
        this.saveData();
    };

    deleteTask(taskId) {
        this.tasks.forEach((el, i) => {
            if (el.id == taskId) this.tasks.splice(i, 1);
        });
        this.saveData();
    };

    moveTaskUp(taskId) {
        let arr = this.tasks;

        for(let i = 0; i < arr.length; i++) {
            let el = arr[i];
            if (el.id == taskId) {
                if (i >= 1) {
                    let temp = arr[i-1];
                    arr[i-1] = arr[i];
                    arr[i] = temp;
                    break;
                }
            }
        }

        this.saveData();
        userInterface.deleteAll();
        this.loadDataFromStorage();
    }

    moveTaskDown(taskId) {
        let arr = this.tasks;

        for(let i = 0; i < arr.length; i++) {
            let el = arr[i];
            if (el.id == taskId) {
                if (i <= arr.length - 2) {
                    let temp = arr[i+1];
                    arr[i+1] = arr[i];
                    arr[i] = temp;
                    break;
                }
            }
        }

        this.saveData();
        userInterface.deleteAll();
        this.loadDataFromStorage();
    }


    saveData () {
        storage.saveTask(this.tasks);
    }
};

const taskList = new TaskList();

class UserInterface {
    addTaskToList(task) {
        const tbody = document.querySelector("#taskTable tbody");
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td> ${task.title} </td>
            <td> ${task.details} </td>
            <td> 
                <button type="button" data-task-id="${task.id}" class="btn btn-danger brn-sm delete">Delete</button> 
                <button type="button" data-task-id="${task.id}" class="btn btn-secondary brn-sm up-arrow">˄</button> 
                <button type="button" data-task-id="${task.id}" class="btn btn-secondary brn-sm down-arrow">˅</button> 
            </td>
        `;

        tbody.appendChild(tr);

        let deleteBtn = document.querySelector(`button.delete[data-task-id='${task.id}']`);
        deleteBtn.addEventListener("click", (e) => this.deleteTask(e));

        let upBtn = document.querySelector(`button.up-arrow[data-task-id='${task.id}']`);
        upBtn.addEventListener("click", (e) => this.upTask(e));

        let downBtn = document.querySelector(`button.down-arrow[data-task-id='${task.id}']`);
        downBtn.addEventListener("click", (e) => this.downTask(e));

        this.clearForm();
    }

    deleteTask(e) {
        const taskId = e.target.getAttribute("data-task-id");
        e.target.parentElement.parentElement.remove();
        taskList.deleteTask(taskId);
    };

    deleteAll() {
        const tbodyRows = document.querySelectorAll("#taskTable tbody tr");

        tbodyRows.forEach(function(el){el.remove();});
    }

    upTask(e) {
        let taskId = e.target.getAttribute("data-task-id");
        taskList.moveTaskUp(taskId);
    }

    downTask(e) {
        let taskId = e.target.getAttribute("data-task-id");
        taskList.moveTaskDown(taskId);
    }

    clearForm() {
        document.getElementById("taskTitle").value = "";
        document.getElementById("taskDetails").value = "";
    }
};

const userInterface = new UserInterface();

class Storage {
    getTask () {
        let tasks = null;
        if (localStorage.getItem("tasks") !== null) {
            tasks = JSON.parse(localStorage.getItem("tasks"));
        } else {
            tasks = [];
        };
        return tasks;
    }
    saveTask (tasks) {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }
};

const storage = new Storage();
