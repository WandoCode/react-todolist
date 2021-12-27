import { useState, useEffect } from "react";
const axios = require("axios");

function UpdateTaskForm(props) {
  const MAX_LENGTH = 40;
  const MAX_NOTE_LENGTH = 5000;

  /* Get The date of dueDate in the correct format to be set as the value of an input:date */
  const today = new Date().toISOString().slice(0, 10);

  /* State */
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [taskState, setTaskState] = useState(false);
  const [showErrorDescription, setshowErrorDescription] = useState(false);
  const [succes, setSucces] = useState(false);

  useEffect(() => {
    /* Reset form */

    setSucces(false);
    /* Fill form with loaded values */
    setDueDate(props.defaultValues.dueDate);
    setDescription(props.defaultValues.description);
    setNotes(props.defaultValues.notes);
    setTaskState(props.defaultValues.done);
    setshowErrorDescription(false);
  }, [props.defaultValues]);

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
    }
  };

  /* Handle close button */
  const closeTask = (e) => {
    e.preventDefault();
    props.askCloseTask();
  };

  /* Handle checkBox input */
  function handleCheckBox() {
    taskState ? setTaskState(false) : setTaskState(true);
  }

  /* Submit form's datas to DB if valid*/
  const submitForm = (e) => {
    e.preventDefault();

    /* If datas are valide: send them to DB */
    if (description.length > 0 && description.length <= MAX_LENGTH) {
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
      props.dbHasChanged();
    } else {
      /* If datas invalid: show adequat error messages */
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
    axios
      .put(dbURL, objectForDd)
      .then(() => {
        /* Display on screen that data base has been updated */
        setSucces(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <form className="updateTask" onSubmit={submitForm}>
      <button onClick={closeTask}>x</button>
      <div className="inner-form">
        <div className="upper-form">
          <label htmlFor="dueDate">
            <input
              type="date"
              name="dueDate"
              id="dueDate"
              value={dueDate}
              onChange={changeDueDate}
            />
          </label>
          <label htmlFor="description">
            <input
              type="text"
              name="description"
              id="description"
              className={showErrorDescription ? "error" : ""}
              maxLength={MAX_LENGTH}
              value={description}
              onChange={getDescriptionValue}
              autoComplete="off"
            />
          </label>
          {showErrorDescription && (
            <div className="description-too-short-update">
              Write a (short) description of your task.
            </div>
          )}
        </div>
        <div className="mid-form">
          <textarea
            name="notes"
            id="note-area"
            maxLength={MAX_NOTE_LENGTH}
            value={notes}
            onChange={getNotes}
            autoComplete="off"
          ></textarea>
        </div>

        <div className="lower-form">
          <input className="submitBtn btn-style-1" type="submit" value="Add" />

          <label htmlFor="status">
            Done
            <input
              type="checkbox"
              name="status"
              className="checkbox-status"
              onChange={handleCheckBox}
              value={taskState}
              checked={taskState}
            />
          </label>
        </div>

        {succes && <div className="succes"> Saved!</div>}
      </div>
    </form>
  );
}

export default UpdateTaskForm;
