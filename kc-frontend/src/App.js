import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/todo/")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {itemList.map((item) => (
          <p>{item.fields.label_text}</p>
        ))}
      </header>
    </div>
  );
}

export default App;
