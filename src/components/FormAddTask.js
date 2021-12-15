import { useState } from "react";
const axios = require("axios");

function FormAddTask(props) {
  const MAX_LENGTH = 150;
  /* Get The date of dueDate in the correct format to be set as the value of an input:date */
  const today = new Date().toISOString().slice(0, 10);

  /* State */
  const [dueDate, setDueDate] = useState(today);
  const [description, setDescription] = useState("");
  const [showErrorDescription, setshowErrorDescription] = useState(false);
  const [showErrorDate, setShowErrorDate] = useState(false);
  const [showErrorForm, setShowErrorForm] = useState(false);

  /* Handle due date input*/
  const changeDueDate = (e) => {
    const choosenDateStr = e.target.value;
    const choosenDate = new Date(choosenDateStr);
    setDueDate(choosenDateStr);

    /* Get the date if not in the past */
    if (choosenDate.valueOf() < new Date(today).valueOf()) {
      setDueDate(choosenDateStr);
    }

    /* Show error if date is in the past */
    toggleDateErrorMessage(choosenDateStr);
  };

  /* Handle description input */
  const getDescriptionValue = (e) => {
    const value = e.target.value;

    /* Get text description if length is correct*/
    if (value.length <= MAX_LENGTH) {
      setDescription(value);
    }

    /* Show error if description's length incorrect */
    toggleDescriptionErrorMessage(value);
  };

  /* Submit form's datas to DB if valid*/
  const submitForm = (e) => {
    e.preventDefault();

    /* If datas are valide: send them to DB */
    if (
      new Date(dueDate).valueOf() >= new Date(today).valueOf() &&
      description.length > 0 &&
      description.length <= MAX_LENGTH
    ) {
      setShowErrorForm(false);

      /* Create the object to store in db */
      const newTask = {
        date: today,
        dueDate: dueDate,
        description: description,
        done: false,
      };

      /* Send object to DB */
      postToDb("http://localhost:8080/tasks", newTask);

      /* Tell App that db has changed */
      props.dbHasChanged();

      /* Rest form values*/
      setDueDate(today);
      setDescription("");
    } else {
      /* If datas invalid: show adequat error messages */
      setShowErrorForm(true);
      toggleDateErrorMessage(dueDate);
      toggleDescriptionErrorMessage(description);
    }
  };

  /* Show error if date is in the past */
  const toggleDateErrorMessage = (date) => {
    if (new Date(date).valueOf() < new Date(today).valueOf()) {
      setShowErrorDate(true);
    } else {
      setShowErrorDate(false);
    }
  };

  /* Show error if description's length incorrect */
  const toggleDescriptionErrorMessage = (text) => {
    if (text.length <= 0 || text.length > MAX_LENGTH) {
      setshowErrorDescription(true);
    } else {
      setshowErrorDescription(false);
    }
  };

  /* Post object to DB */
  const postToDb = (dbURL, objectForDd) => {
    axios.post(dbURL, objectForDd).catch(function (error) {
      console.log(error);
    });
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
      {showErrorDate && (
        <div className="date-in-paste">Choose a date in the future.</div>
      )}
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
      {showErrorForm && (
        <div className="invalid-Datas"> Please, resolves error(s).</div>
      )}
    </form>
  );
}

export default FormAddTask;
