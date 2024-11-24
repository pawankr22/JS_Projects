/* This eventlistner waits until the DOM is fully loaded before executing
 the function */
document.addEventListener('DOMContentLoaded', () => {
    /*These 3 are the element section which selects the input field, the button
    for adding tasks, and the unordered list where tasks will be displayed */
    const todoInput = document.getElementById("todo-input");
    const addTaskButton = document.getElementById("add-task-btn");
    const todoList = document.getElementById("todo-list");

    /* These 2 are the LOCAL STORAGE RETRIEVAL . 
    Tasks are retrieved from the local storage, parsed into javascript objects , and
    rendered on the page.*/
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task))

    /* Adding New Tasks.
    → Event Listener: When the "Add Task" button is clicked, the function is executed.
    → Add Task: Adds the new task to the tasks array.
    → Save and Render: Saves tasks to local storage and renders the new task. Clears the input field afterward.
    */
    addTaskButton.addEventListener('click', () => {
        const taskText = todoInput.value.trim(); //Input Trim: Removes whitespace from the input value.
        if (taskText === "") return;

        const newTask = {  // New Task Object: Creates a new task with a unique ID, the text from the input field, and a completed status set to false.
            id: Date.now(),
            text: taskText,
            completed: false
        }
        tasks.push(newTask);
        saveTasks();
        renderTask(newTask);
        todoInput.value = ""; //clear input 
        console.log(tasks);
    });

    // Task Rendering

    /*
    → Create Element: Creates a new <li> element for the task.
    → Set Attribute: Sets the data-id attribute to the task's ID.
    → Class Toggle: Toggles the completed class based on the task's completed status.
    → Inner HTML: Adds the task text and a delete button to the <li>.
    → Toggle Completion: If the list item (excluding the button) is clicked, it toggles the task's completed status and updates the class and local storage.
    → Delete Task: If the delete button is clicked, it stops event bubbling, removes the task from the array, removes the <li> from the DOM, and updates local storage.
    → Append to List: Appends the new task to the list.
    */
    function renderTask(task) {
        const li = document.createElement('li')
        li.setAttribute('data-id', task.id);
        if (task.completed) li.classList.add('completed');
        li.innerHTML = `
        <span>${task.text}</span>
        <button>delete</button>
        `;
        li.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            task.completed = !task.completed;
            li.classList.toggle('completed');
            saveTasks();

        });

        li.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation()  // stop the event from bubbling up
            tasks = tasks.filter(t => t.id !== task.id);
            li.remove();
            saveTasks();

        })

        todoList.appendChild(li);

    }


    // localStorage Saving

    // This function saves the tasks array to local storage, converting it into a JSON string.
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks))
    }
})