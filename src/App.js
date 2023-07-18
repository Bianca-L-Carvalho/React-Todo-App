import './App.css';

import {useState, useEffect} from "react";
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from "react-icons/bs";

const API = "http://localhost:5000";

function App() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  //Load todo's on page load - extrair as tarefasa passadas para a API
  useEffect(() => { //quando a página recarrega ele executa a função loadData que utiliza a fetch API e trás os dados guardados nele
    const loadData = async () => {
      setLoading(true); //carrega os dados

      const res = await fetch(API + "/todos") // guarda os dados vindos  do fetch da api
      .then((res) => res.json()) // transforma essa resposta em json
      .then((data) => data) // retorna essa resposta em um array de objetos
      .catch((err) => console.log(err));

      setLoading(false); // indica que o pedido já terminou de ser executado 
      setTodos(res); //passa a resposta vinda do json- após virar um array de objetos, para a variável todos
    };
    loadData(); // cahmada para essa função quando a página é recarregada
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();//esse método evita  que a página seja recarregada quando o form é envido

    const todo = {
      id: Math.random(),
      title,
      time,
      done:false
    };

    // envio para api nativa do js
    await fetch(API + "/todos", {
      method: "POST",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });

    setTodos((prevState) => [...prevState, todo]); // pego o estado anterior da variável e adiciono o novo estado a ela, sem precisar fazer f5 da página para pegar os novos dados add a API. Ou seja, já atualiza pro usuário a lista de todos quando ele add uma nova tarefa
   
    setTitle(""); //quando envio o form o titulo é limpo
    setTime("");
  }; 

  const handleDelete = async(id) => {
    await fetch(API + "/todos/" + id, {
      method: "DELETE",
    });
   
    setTodos((prevState) => prevState.filter((todo) => todo.id !== id)); //pega todos os todo's e faz uma comparação. se os ids dos todos retornados  pela api forem iguais aos que estão sendo mostrados no front-End, ele retorna essas tarefas. se não, exclui elas também do back-end.
  }; 
  
  //atualização de tarefas - concluido
  const handleEdit = async (todo) => {
    todo.done = !todo.done;

    const data = await fetch(API + "/todos/" + todo.id, { //retorna tarefas atualizadas da API
      method: "PUT",
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
   
    setTodos((prevState) => prevState.map((task) => task.id === data.id ? (task = data) : task)); //pega todos os todo's e faz uma comparação. se os  todos retornados  pela api forem iguais aos que estão sendo mostrados no front-End, ele retorna essas tarefas, se forem diferentes ele atualiza as do front-end de acordo com os que vieram no back;
  }; 

  if(loading) { // enquantto a página estiver recarregando mostra essa mensagem
    return <p>carregando...</p>
  }

  return (
    <div className="App">
      <div className='todo-header'>
        <h1>React Todo</h1>
      </div>
      <div className='form-todo'>
        <h2>Insira a sua próxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className='form-control'>
            <label htmlFor="title">O que você vai fazer?</label>
            <input 
            type="text" 
            name='title' 
            placeholder='Título da tarefa' 
            onChange={(e) => setTitle(e.target.value)} 
            value={title || ""}
            required
            /> {/*coloca no title o valor do input*/}
          </div>
  
          <div className='form-control'>
            <label htmlFor="time">Duração:</label>
            <input 
            type="text" 
            name='time' 
            placeholder='Tempo estimado (em horas)' 
            onChange={(e) => setTime(e.target.value)} 
            value={time || ""}
            required
            /> {/*coloca no title o valor do input*/}
          </div>
          <input type="submit" value="Criar Tarefa"></input>
          
        </form>
      </div>
      <div className='list-todo'>
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? "todo-done" : ""}>{todo.title}</h3>
            <p>Duração: {todo.time}</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() =>handleDelete(todo.id)}/>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
}

export default App;
