import { useState, useEffect } from "react";

const axios = require("axios");

function FormAddTask(props) {
  const MAX_LENGTH = 40;
  /* Get The date of dueDate in the correct format to be set as the value of an input:date */
  const today = new Date().toISOString().slice(0, 10);

  /* State */
  const [dueDate, setDueDate] = useState(today);
  const [description, setDescription] = useState("");
  const [showErrorDescription, setshowErrorDescription] = useState(false);
  const [showErrorDate, setShowErrorDate] = useState(false);

  useEffect(() => {
    if (props.defaultValues) {
      setDueDate(props.defaultValues.dueDate);
      setDescription(props.defaultValues.description);
    }
  }, [props.defaultValues]);

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
  const submitForm = async (e) => {
    e.preventDefault();

    /* If datas are valide: send them to DB */
    if (
      new Date(dueDate).valueOf() >= new Date(today).valueOf() &&
      description.length > 0 &&
      description.length <= MAX_LENGTH
    ) {
      /* Create the object to store in db */
      const newTask = {
        date: today,
        dueDate: dueDate,
        description: description,
        notes: "",
        done: false,
      };

      /* Send object to DB */
      const data = await postToDb("http://localhost:8080/tasks", newTask);

      /* Tell App that db has changed */
      props.dbHasChanged(data.id);

      /* tell App to open the new task's update form */

      /* Rest form values*/
      setDueDate(today);
      setDescription("");
    } else {
      /* If datas invalid: show adequat error messages */
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
  const postToDb = async (dbURL, objectForDd) => {
    let res = await axios.post(dbURL, objectForDd);
    return res.data;
  };

  return (
    <form className="addTask">
      <div className="input-wrapper">
        <div className="addTask-upper-form">
          <label htmlFor="description">Task</label>
          <input
            type="text"
            name="description"
            id="description"
            maxLength={MAX_LENGTH}
            value={description}
            onChange={getDescriptionValue}
            autoComplete="off"
          />
          {showErrorDescription && (
            <div className="description-too-short">
              Write a (short) description of your task.
            </div>
          )}
        </div>
        <div className="addTask-lower-form">
          <label htmlFor="dueDate"></label>
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
          <button
            className="submitBtn addTaskBtn btn-style-1"
            onClick={submitForm}
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
}

export default FormAddTask;
