import { useState, useEffect } from "react";
const axios = require("axios");

function UpdateTaskForm(props) {
  const MAX_LENGTH = 150;
  const MAX_NOTE_LENGTH = 10000;

  /* Get The date of dueDate in the correct format to be set as the value of an input:date */
  const today = new Date().toISOString().slice(0, 10);

  /* State */
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [taskState, setTaskState] = useState(false);
  const [showErrorDescription, setshowErrorDescription] = useState(false);
  const [showErrorForm, setShowErrorForm] = useState(false);
  const [showErrorNotes, setShowErrorNotes] = useState(false);

  /* Fill form with loaded values */
  useEffect(() => {
    setDueDate(props.defaultValues.dueDate);
    setDescription(props.defaultValues.description);
    setNotes(props.defaultValues.notes);
  }, [props.defaultValues]);

  /* Handle button */
  const toggleState = (e) => {
    e.preventDefault();
    setTaskState(!taskState);
  };

  /* Handle due date input*/
  const changeDueDate = (e) => {
    const choosenDateStr = e.target.value;
    setDueDate(choosenDateStr);
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

  /* Handle textarea input */
  const getNotes = (e) => {
    if (e.target.value.length <= MAX_NOTE_LENGTH) {
      setNotes(e.target.value);
    } else {
      setShowErrorNotes(true);
    }
  };

  /* Handle close button */
  const closeTask = (e) => {
    e.preventDefault();
    props.askCloseTask();
  };

  /* Submit form's datas to DB if valid*/
  const submitForm = (e) => {
    e.preventDefault();

    /* If datas are valide: send them to DB */
    if (description.length > 0 && description.length <= MAX_LENGTH) {
      setShowErrorForm(false);
      setShowErrorNotes(false);

      /* Create the object to store in db */
      const newTask = {
        date: today,
        dueDate: dueDate,
        description: description,
        notes: notes,
        done: taskState,
      };

      /* Update object in DB */
      putToDb(`http://localhost:8080/tasks/${props.defaultValues.id}`, newTask);

      /* Tell App that db has changed and that the component can be closed*/
      props.askCloseTask();
    } else {
      /* If datas invalid: show adequat error messages */
      setShowErrorForm(true);
      setShowErrorNotes(true);
      toggleDescriptionErrorMessage(description);
    }
  };

  ///* Error message *///
  /* Show error if description's length incorrect */
  const toggleDescriptionErrorMessage = (text) => {
    if (text.length <= 0 || text.length > MAX_LENGTH) {
      setshowErrorDescription(true);
    } else {
      setshowErrorDescription(false);
    }
  };

  /* Post object to DB */
  const putToDb = (dbURL, objectForDd) => {
    axios.put(dbURL, objectForDd).catch(function (error) {
      console.log(error);
    });
  };

  return (
    <form className="updateTask" onSubmit={submitForm}>
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

      <textarea
        name="notes"
        id="note-area"
        maxLength={MAX_NOTE_LENGTH}
        value={notes}
        onChange={getNotes}
      ></textarea>
      {showErrorNotes && (
        <div className="notes-error">
          Try to write less than {MAX_NOTE_LENGTH}
        </div>
      )}
      {showErrorDescription && (
        <div className="description-too-short">
          Write a (short) description of your task.
        </div>
      )}

      <input type="submit" value="Add" />

      {showErrorForm && (
        <div className="invalid-Datas"> Please, resolves error(s).</div>
      )}

      {taskState ? (
        <button onClick={toggleState} className="button-not-done">
          Mark as not done
        </button>
      ) : (
        <button onClick={toggleState} className="button-done">
          Mark as done
        </button>
      )}

      <button onClick={closeTask}>Close</button>
    </form>
  );
}

export default UpdateTaskForm;
