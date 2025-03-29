let tasks = []

//LOCAL ESTORAGE 
const getTasksFromLocalStorage = () =>{
  const localTasks = JSON.parse(window.localStorage.getItem('tasks'))
  return localTasks ? localTasks : [];
}

const setTasksInLocalStorage = (tasks) =>{
  window.localStorage.setItem('tasks', JSON.stringify(tasks))
}


//REMOVE TASKS
const removeTask = (taskId) =>{
  const tasks = getTasksFromLocalStorage();
  const updatedTasks = tasks.filter(({id}) => parseInt(id) !== parseInt(taskId));
  setTasksInLocalStorage(updatedTasks)

  document
          .getElementById("todo-list")
          .removeChild(document.getElementById(taskId));
  
  countTask()
}

const removeDoneTasks = () =>{
  const tasks = getTasksFromLocalStorage()
  const tasksToRemove = tasks
        .filter(({checked}) => checked)
        .map(({id}) => id)

  const updatedTasks = tasks.filter(({checked}) => !checked);
  setTasksInLocalStorage(updatedTasks)

  tasksToRemove.forEach((tasksToRemove) => {
    document
      .getElementById("todo-list")
      .removeChild(document.getElementById(tasksToRemove))
  })
  countTask()
}

const createTaskListItem = (task, checkbox) =>{
  const list = document.getElementById('todo-list');
  const toDo = document.createElement('li')

  const removeTaskButton = document.createElement('button');
  removeTaskButton.textContent = 'x';
  removeTaskButton.ariaLabel = 'Remover Tarefa';

  removeTaskButton.onclick = () =>removeTask(task.id);

  toDo.id = task.id;
  toDo.appendChild(checkbox)
  toDo.appendChild(removeTaskButton)
  list.appendChild(toDo);

  return toDo;
}


//CHECKBOX INPUT
const onCheckboxClick = (event) =>{
  const [id] = event.target.id.split('-')
  const tasks = getTasksFromLocalStorage()

  const updatedTasks = tasks.map((task) => {
    return parseInt(id) === parseInt(task.id)
            ? {...task, checked: event.target.checked}
            :  task
  }) 
  setTasksInLocalStorage(updatedTasks)
  countTask()
}

const getCheckboxInput = ({id, description, checked }) => {
  const checkbox = document.createElement('input');
  const label = document.createElement('label');
  const wrapper = document.createElement('div');
  const checkboxID = `${id}-checkbox`

  checkbox.type = "checkbox";
  checkbox.id = checkboxID;
  checkbox.checked = checked || false;
  checkbox.addEventListener('change',onCheckboxClick)

  label.textContent = description;
  label.htmlFor = checkboxID;

  wrapper.className = 'checkbox-label-container';

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);

  return wrapper;
}



// CREATE TASKS
const getNewTaskId = () =>{
  const tasks = getTasksFromLocalStorage()
  const lastID = tasks[tasks.length -1]?.id
  return lastID ? lastID + 1 : 1;
}


const getNewTaskData = (event) =>{
  const description = event.target.elements.description.value;
  const id = getNewTaskId();

  return {description, id};
}


const getCreatedTaskInfo = (event) => new Promise((resolve) => {
  setTimeout(() => {
      resolve(getNewTaskData(event))
  }, 3000)
})

const createTask = async (event) =>{
  event.preventDefault();
  document.getElementById('save-task').setAttribute('disabled',true)
  const newTaskData = await getCreatedTaskInfo(event)

  const checkbox = getCheckboxInput(newTaskData)
  createTaskListItem(newTaskData, checkbox)

  const tasks = getTasksFromLocalStorage();
  const updatedTasks = [
    ...tasks, 
    {id:newTaskData.id, description:newTaskData.description, checked:false}
  ]
  setTasksInLocalStorage(updatedTasks)
  countTask()

  document.getElementById('description').value = ''
  document.getElementById('save-task').removeAttribute('disabled')
}

const countTask = () =>{
  let tasks = getTasksFromLocalStorage();
  let check = 0;
  let sum = 0;
  let span  = document.getElementById("count-tasks");
  if (tasks.length === 0){
    span.textContent =`${check}/${sum} concluídas`
  } else {
    tasks.forEach((task) =>{
      task.checked == true ? check++ : check = check
      sum++      
      span.textContent = `${check}/${sum} concluídas`;
    })
   
  }
}


// CARREGAR A PAGINA COM AS INFOS
window.onload = function() {
  const form = document.getElementById('create-todo-form');
  form.addEventListener('submit', createTask)

  const tasks = getTasksFromLocalStorage();
  countTask()
  
  tasks.forEach((task) => {
    const checkbox = getCheckboxInput(task);
    createTaskListItem(task,checkbox)
    
   
    
  });
 
}