import FormAddTask from "./components/FormAddTask";
import TasksList from "./components/TasksList";
import { useState, useEffect } from "react";

function App() {
  const [dbChanged, setDbChanged] = useState(true);

  const dbHasChanged = () => {
    setDbChanged(true);
  };

  useEffect(() => {
    setDbChanged(false);
  }, [dbChanged]);

  return (
    <div className="App">
      <FormAddTask dbHasChanged={dbHasChanged} />
      <TasksList lookDb={dbChanged} />
    </div>
  );
}

export default App;
