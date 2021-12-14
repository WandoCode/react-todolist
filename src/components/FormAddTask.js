import { useState } from "react";

function FormAddTask(props) {
  const MAX_LENGTH = 150;
  /* Get The date of dueDate in the correct format to be set as the value of an input:date */
  const today = new Date().toISOString().slice(0, 10);

  /* State */
  const [dueDate, setDueDate] = useState(today);
  const [description, setDescription] = useState("");
  const [showErrorDescription, setshowErrorDescription] = useState(false);

  /* Handle due date input*/
  const changeDueDate = (e) => {
    setDueDate(e.target.value);
    console.log(VALIDATION); // TODO: Validation date + Add error message in render if dueDate is in the past.
  };

  /* Handle description input */
  const getDescriptionValue = (e) => {
    const value = e.target.value;

    /* Get and validate text description */
    if (value.length <= MAX_LENGTH) {
      setDescription(value);
      setshowErrorDescription(false);
    }

    /* Show error if description's length incorrect */
    if (value.length > MAX_LENGTH || value.length <= 0)
      setshowErrorDescription(true);
  };

  /* Submit form's datas to DB */
  const submitForm = (e) => {
    e.preventDefault();

    const newTask = {
      date: today,
      dueDate: dueDate,
      description: description,
      done: false,
    };
  };

  return (
    <form className="addTask" onSubmit={submitForm}>
      <label htmlFor="dueDate">Due date</label>
      <input
        type="date"
        name="dueDate"
        id="dueDate"
        value={dueDate}
        onChange={changeDueDate}
      />
      <label htmlFor="description">Task</label>

      <input
        type="text"
        name="description"
        id="description"
        maxLength={MAX_LENGTH}
        value={description}
        onChange={getDescriptionValue}
      />
      {showErrorDescription && (
        <div className="description-too-short">
          Write a (short) description of your task.
        </div>
      )}
      <input type="submit" value="Add" />
    </form>
  );
}

export default FormAddTask;
