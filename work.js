let items = [];
const introInput = document.querySelector('.introduce');
const completedTodosDiv = document.querySelector('.done');
const uncompletedTodosDiv = document.querySelector('.undone');

window.onload = () => {
    let storageItems = localStorage.getItem('items'); //localStorage permite almacenar datos en el navegador
    if(storageItems !== null) {
        items = JSON.parse(storageItems); //JSON.parse convierte el valor guardado en JSON en su representación original
    }  //esto se hace porque el localstorage siempre guarda los datos en cadenas de texto
    render();
}

introInput.onkeyup = ((e) => {  //onkeyup se activa cada vez que se suelta una tecla, e contiene que tecla fue pulsada
    let value = e.target.value.replace(/^\s+/,""); //obtiene el valor del campo de texto y elimina los espacios en blanco del principio
    if (value && e.keyCode === 13) { //keycode 13 hace referencia al enter
        addTodo(value);

        introInput.value = ''; //reinicia el valor del campo de texto
        introInput.focus(); //el foco del curso regresa al campo de texto
    }
})

function addTodo(text){
    items.push({
        id: Date.now(),
        text,
        completed: false
    })
    saveAndRender();
}

function removeTodo(id){
    items = items.filter(todo => todo.id !== Number(id));
    saveAndRender();
}

function markAsCompleted(id){
    items = items.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = true;
        }
        return todo;
    })

    saveAndRender();
}

function markAsUncompleted(id){
    items = items.filter(todo => {
        if(todo.id === Number(id)){
            todo.completed = false;
        }
        return todo;
    })

    saveAndRender();
}


function save() {
    localStorage.setItem('items', JSON.stringify(items));
}

function render() {
    let unCompletedTodos = items.filter(item => !item.completed);
    let completedTodos = items.filter(item => item.completed);

    completedTodosDiv.innerHTML = '';
    uncompletedTodosDiv.innerHTML = '';

    if(unCompletedTodos.length > 0){
        unCompletedTodos.forEach(todo => {
            uncompletedTodosDiv.append(createTodoElement(todo));
        })
    }else{
        uncompletedTodosDiv.innerHTML = `<div class='empty'> Nothing undone</div>`;
    }

    if(completedTodos.length > 0){
        completedTodosDiv.innerHTML = `<div class='done-title'> Completed (${completedTodos.length} / ${items.length})</div>`;

        completedTodos.forEach(todo => {
            completedTodosDiv.append(createTodoElement(todo));
        })
    }

}

function saveAndRender() {
    save();
    render();
}

function createTodoElement(todo){
    const todoDiv = document.createElement('div');
    todoDiv.setAttribute('data-id', todo.id);
    todoDiv.className = 'todo_item';

    const todoTextSpan = document.createElement('span');
    todoTextSpan.innerHTML = todo.text;

    const todoInputCheckbox = document.createElement('input');
    todoInputCheckbox.type = 'checkbox';
    todoInputCheckbox.checked = todo.completed;
    todoInputCheckbox.onclick = (e) => {
        let id = e.target.closest('.todo_item').dataset.id;
        e.target.checked ? markAsCompleted(id) : markAsUncompleted(id);
    }

    const todoRemoveBtn = document.createElement('a');
    todoRemoveBtn.href = '#';
    todoRemoveBtn.innerHTML = `<i class="material-icons">close</i>`;

    todoRemoveBtn.onclick = (e) => {
        let id = e.target.closest('.todo_item').dataset.id;
        removeTodo(id);
    }
    todoTextSpan.prepend(todoInputCheckbox);
    todoDiv.appendChild(todoTextSpan);
    todoDiv.appendChild(todoRemoveBtn);

    return todoDiv;

}
