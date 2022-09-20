//Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue; //salva os antigos valores

//funções

//Cria um novo todo e adiciona todos os itens nele (editar, finalizar, salvar e excluir)
const saveTodo = (text, done = 0, save = 1) => {
    const todo = document.createElement("div"); //cria a div geral, onde haverá a classe todo
    todo.classList.add("todo"); //add em string uma classe
  
    const todoTitle = document.createElement("h3"); //titulo da tarefa
    todoTitle.innerText = text; //informa que o valor recebido é um Texto.
    todo.appendChild(todoTitle);
  
    const doneBtn = document.createElement("button"); //cria o botão de finalizar tarefa
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'; //colocar o icon dentro do botão, através de texto (tag) html
    todo.appendChild(doneBtn);
  
    const editBtn = document.createElement("button"); //cria o botão de editar tarefa
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);
  
    const deleteBtn = document.createElement("button"); //cria o botão de deletar tarefa
    deleteBtn.classList.add("remove-todo");
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(deleteBtn);
  
    // Utilizando dados da localStorage
    if (done) {
      todo.classList.add("done");
    }
  
    if (save) {
      saveTodoLocalStorage({ text, done: 0 });
    }
  
    todoList.appendChild(todo); //coloca o novo todo na lista de todos, na tela.
  
    todoInput.value = ""; //após salvar o novo todo, limpa o campo de escrita.
  };
  
  const toggleForms = () => { //alteração de formulários; Se estiver sendo exibido, ele esconde; se estiver escondido, ele exibe.
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
  };
  

  //função que atualiza o todo (campo editar todo)
  const updateTodo = (text) => {
    const todos = document.querySelectorAll(".todo"); //seleciona todos os "todos". Como se trata de uma classe (classe todo), tem que colocar ".todo".
  
    todos.forEach((todo) => { //percorre a lista de todos, buscando o que possui título igual o valor da variável "oldInputValue" (valor antigo do título do todo que foi editado) e atualia o valor.
      let todoTitle = todo.querySelector("h3");
  
      if (todoTitle.innerText === oldInputValue) {
        todoTitle.innerText = text;
  
        // Utilizando dados da localStorage
        updateTodoLocalStorage(oldInputValue, text);
      }
    });
  };
  
  const getSearchedTodos = (search) => {
    const todos = document.querySelectorAll(".todo");
  
    todos.forEach((todo) => {
      const todoTitle = todo.querySelector("h3").innerText.toLowerCase();
  
      todo.style.display = "flex";
  
      console.log(todoTitle);
  
      if (!todoTitle.includes(search)) {
        todo.style.display = "none";
      }
    });
  };
  
  const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".todo");
  
    switch (filterValue) {
      case "all":
        todos.forEach((todo) => (todo.style.display = "flex"));
  
        break;
  
      case "done":
        todos.forEach((todo) =>
          todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
        );
  
        break;
  
      case "todo":
        todos.forEach((todo) =>
          !todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : (todo.style.display = "none")
        );
  
        break;
  
      default:
        break;
    }
  };

//Eventos

todoForm.addEventListener("submit", (e)=> {
    e.preventDefault(); //como não estamos trabalhando com backend, essa linha impede que o formulário faça envio.

    const inpuValue = todoInput.value; //pega o valor que o usuario digitou

    if (inpuValue) {  //validação para garantir que o usuário não crie tarefas sem título
        saveTodo(inpuValue); //salva o todo
    }
});


document.addEventListener("click", (e) => {
    //pega o evento de clique, verificando qual elemento/botão recebeu o clique.

    const targetEl = e.target; //pega o elemento que foi clicado
    const parentEl = targetEl.closest("div"); //pega o elemento pai (o elemento div mais próximo)
    let todoTitle; //Como nesse projeto não estamos usando id, é necessário pegar o título do elemento.
  
    if (parentEl && parentEl.querySelector("h3")) { //testa se o parentEl existe
      todoTitle = parentEl.querySelector("h3").innerText || "";
    }
  
    if (targetEl.classList.contains("finish-todo")) { //testa para descobrir se o botão clicado foi o de finalizar
      parentEl.classList.toggle("done"); //adiciona a classe done aos todos selecionados, porém verifica se já possui. Se possuir, ele remove. Se não tem, ele adiciona.
  
      updateTodoStatusLocalStorage(todoTitle);
    }
  
    if (targetEl.classList.contains("remove-todo")) {
      parentEl.remove(); //remove o elemento pai.
  
      // Utilizando dados da localStorage
      removeTodoLocalStorage(todoTitle);
    }
  
    if (targetEl.classList.contains("edit-todo")) {
      toggleForms(); //esconde o formulário e mostra outro.
    
      editInput.value = todoTitle; //muda o valor do titulo
      oldInputValue = todoTitle; //salva o valor antigo na memória
    }
  });
  
  cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault(); //não envia formulário
    toggleForms(); //muda o formulário
  });
  
  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
  
    const editInputValue = editInput.value; //pega o valor novo e coloca na variável
  
    if (editInputValue) { //testa se não está vazio. Se estiver, cancela a edição. Se não estiver, atualiza o todo.
      updateTodo(editInputValue);
    }
  
    toggleForms(); //muda o formulário
  });
  
  searchInput.addEventListener("keyup", (e) => {
    const search = e.target.value;
  
    getSearchedTodos(search);
  });
  
  eraseBtn.addEventListener("click", (e) => {
    e.preventDefault();
  
    searchInput.value = "";
  
    searchInput.dispatchEvent(new Event("keyup"));
  });
  
  filterBtn.addEventListener("change", (e) => {
    const filterValue = e.target.value;
  
    filterTodos(filterValue);
  });
  

  // Local Storage
  const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
  
    return todos;
  };
  
  const loadTodos = () => {
    const todos = getTodosLocalStorage();
  
    todos.forEach((todo) => {
      saveTodo(todo.text, todo.done, 0);
    });
  };
  
  const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();
  
    todos.push(todo);
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    const filteredTodos = todos.filter((todo) => todo.text != todoText);
  
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
  };
  
  const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoText ? (todo.done = !todo.done) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoOldText ? (todo.text = todoNewText) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  loadTodos();