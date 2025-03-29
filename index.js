let tasks = [
  {id:1, description: "comprar pão", checked: false},
  {id:2, description: "passear com o cachorro", checked: false},
  {id:3, description: "fazer o almoço", checked: false},
]

const removeTask = (taskId) =>{
  tasks = tasks.filter(({id}) => parseInt(id) !== parseInt(taskId));

  document
          .getElementById("todo-list")
          .removeChild(document.getElementById(taskId));
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

const getCheckboxInput = ({id, description, checked }) => {
  const checkbox = document.createElement('input');
  const label = document.createElement('label');
  const wrapper = document.createElement('div');
  const checkboxID = `${id}-checkbox`

  checkbox.type = "checkbox";
  checkbox.id = checkboxID;
  checkbox.checked = checked || false;

  label.textContent = description;
  label.htmlFor = checkboxID;

  wrapper.className = 'checkbox-label-container';

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);

  return wrapper;
}

const getNewTaskId = () =>{
  const lastID = tasks[tasks.length -1]?.id
  return lastID ? lastID + 1 : 1;
}

const getNewTaskData = (event) =>{
  const description = event.target.elements.description.value;
  const id = getNewTaskId();

  return {description, id};
}

const createTask = (event) =>{
  event.preventDefault();
  const NewTaskData = getNewTaskData(event)
  //const {id,description} = NewTaskData;

  const checkbox = getCheckboxInput(NewTaskData)
  createTaskListItem(NewTaskData, checkbox)

  tasks = [
    ...tasks, 
    {id:NewTaskData.id, description:NewTaskData.description, checked:false}]
}

window.onload = function() {
  const form = document.getElementById('create-todo-form');
  form.addEventListener('submit', createTask)

  tasks.forEach((task) => {
    const checkbox = getCheckboxInput(task);
    createTaskListItem(task,checkbox)
    
  });
}