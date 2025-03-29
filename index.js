let tasks = []

const renderTasksProgressData = (tasks) =>{
  let tasksProgress;
  const tasksProgressDom = document.getElementById('tasks-progress')

  if (tasksProgressDom) tasksProgress = tasksProgressDom;
  else{
    const newTasksProgressDom = document.createElement('div')
    newTasksProgressDom.id = 'tasks-progress'
    document.getElementById('todo-footer').appendChild(newTasksProgressDom)
    tasksProgress = newTasksProgressDom
  }

  const doneTasks = tasks.filter(({checked}) => checked).length
  const totalTasks = tasks.length
  tasksProgress.textContent = `${doneTasks}/${totalTasks} concluídas`
}

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
  renderTasksProgressData(updatedTasks)

  document
          .getElementById("todo-list")
          .removeChild(document.getElementById(taskId));
}

const removeDoneTasks = () =>{
  const tasks = getTasksFromLocalStorage()
  const tasksToRemove = tasks
        .filter(({checked}) => checked)
        .map(({id}) => id)

  const updatedTasks = tasks.filter(({checked}) => !checked);
  setTasksInLocalStorage(updatedTasks)
  renderTasksProgressData(updatedTasks)

  tasksToRemove.forEach((tasksToRemove) => {
    document
      .getElementById("todo-list")
      .removeChild(document.getElementById(tasksToRemove))
  })
  
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
  renderTasksProgressData(updatedTasks)
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
  renderTasksProgressData(updatedTasks)
 

  document.getElementById('description').value = ''
  document.getElementById('save-task').removeAttribute('disabled')
}


// CARREGAR A PAGINA COM AS INFOS
window.onload = function() {
  const form = document.getElementById('create-todo-form');
  form.addEventListener('submit', createTask)

  const tasks = getTasksFromLocalStorage();
 
  
  tasks.forEach((task) => {
    const checkbox = getCheckboxInput(task);
    createTaskListItem(task,checkbox)
    
   
    
  });
 
  renderTasksProgressData(tasks)
}