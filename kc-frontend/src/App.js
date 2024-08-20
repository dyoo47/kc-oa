import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [itemList, setItemList] = useState([]);
  const [labelText, setLabelText] = useState("");

  const fetchTodoItems = () => {
    fetch("http://localhost:8000/todo/")
      .then((response) => response.json())
      .then((data) => {
        setItemList(data);
        console.log(data);
      });
  };

  useEffect(() => {
    fetchTodoItems();
  }, []);

  const TodoItem = (props) => {
    return (
      <div
        className="flex cursor-pointer justify-between mt-2 rounded p-4 bg-slate-600 bg-opacity-0 hover:bg-opacity-40 transition duration-150 ease-out"
        onClick={() => {
          // Send POST request to update backend
          fetch("http://localhost:8000/todo/update", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              item_id: props.item.pk,
              is_done: !props.item.fields.is_done,
            }),
          });

          // Update frontend state
          setItemList(
            itemList.map((item) => {
              if (item.pk === props.item.pk) {
                item.fields.is_done = !item.fields.is_done;
              }
              return item;
            })
          );
        }}
      >
        <p className={props.item.fields.is_done ? "line-through" : ""}>
          {props.item.fields.label_text}
        </p>
      </div>
    );
  };

  return (
    <div className="bg-slate-400 w-screen h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center py-8">To-do App</h1>
        <div className="flex">
          <input
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={labelText}
            onChange={(e) => {
              setLabelText(e.target.value);
            }}
            type="text"
            placeholder="Enter a new to-do item..."
          ></input>
          <button
            class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => {
              fetch("http://localhost:8000/todo/add", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  label_text: labelText,
                }),
              }).then(() => {
                fetchTodoItems();
              });
            }}
          >
            Add
          </button>
        </div>
        {itemList.map((item) => (
          <TodoItem item={item}></TodoItem>
        ))}
      </div>
    </div>
  );
}

export default App;
