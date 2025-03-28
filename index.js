let tasks = [
  {id:1, description: "comprar pão", checked: false},
  {id:2, description: "passear com o cachorro", checked: false},
  {id:3, description: "fazer o almoço", checked: false},
]

const getCheckboxInput = ({id, description }) => {
  const checkbox = document.createElement('input');
  const label = document.createElement('label');
  const wrapper = document.createElement('div');
  const checkboxID = `${id}-checkbox`

  checkbox.type = "checkbox";
  checkbox.id = checkboxID;
  checkbox.checked = tasks.checked;

  label.textContent = description;
  label.htmlFor = checkboxID;

  wrapper.className = 'checkbox-label-container';

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);

  return wrapper;
}

window.onload = function() {
  tasks.forEach((task) => {
    const checkbox = getCheckboxInput(task);

    const list = document.getElementById('todo-list');
    const toDo = document.createElement('li');
    //const button = document.createElement("button")

    toDo.id = task.id;
    toDo.appendChild(checkbox);
    //toDo.appendChild(button);

    list.appendChild(toDo);
    
  });
}