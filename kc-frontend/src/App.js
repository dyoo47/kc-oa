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
      });
  };

  const addTodoItem = () => {
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
      setLabelText("");
    });
  };

  const updateTodoItem = (itemToUpdate) => {
    // Send POST request to update backend
    fetch("http://localhost:8000/todo/update", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        item_id: itemToUpdate.pk,
        is_done: !itemToUpdate.fields.is_done,
      }),
    });

    // Update frontend state
    setItemList(
      itemList.map((item) => {
        if (item.pk === itemToUpdate.pk) {
          item.fields.is_done = !item.fields.is_done;
        }
        return item;
      })
    );
  };

  const formatDate = (dateString) => {
    var date = new Date(dateString);
    return date.getDate() + " " + months[date.getMonth()];
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    fetchTodoItems();
  }, []);

  const TodoItem = ({ item }) => {
    return (
      <div
        className="flex font-bold cursor-pointer justify-between border-b p-4 bg-slate-300 bg-opacity-0 hover:bg-opacity-40 transition duration-150 ease-out"
        onClick={() => {
          updateTodoItem(item);
        }}
      >
        <p className={item.fields.is_done ? "line-through" : ""}>
          <input
            type="checkbox"
            className="mr-4"
            checked={item.fields.is_done}
          />
          {item.fields.label_text}
        </p>
        <p className="font-normal text-gray-400">
          {formatDate(item.fields.added_date)}
        </p>
      </div>
    );
  };

  return (
    <div className="w-screen h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl text-center py-8">To-do App</h1>
        <div className="flex">
          <input
            class="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={labelText}
            onChange={(e) => {
              setLabelText(e.target.value);
            }}
            type="text"
            placeholder="Enter a new to-do item..."
          ></input>
          <button
            class="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => {
              addTodoItem();
            }}
          >
            {/* "plus" from https://heroicons.com/ */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
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
