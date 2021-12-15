import { useState } from "react";

function Sorting(props) {
  const [sortingValue, setSortingValue] = useState();
  const [reverseOrder, setReverseOrder] = useState(false);

  /* Handle change in select input for sorting */
  const handleSortingSelect = (e) => {
    /*Send sorting value to TasksList */
    props.chooseSorting(e.target.value);

    /* Chang value displayed */
    setSortingValue(e.target.value);
  };

  /* Handle click on 'reverse' button */
  const handleOrder = () => {
    /* Change the value of the button */
    setReverseOrder(() => !reverseOrder);

    /* Send the sort order to tasksList */
    props.chooseReverseOrder();
  };

  return (
    <div className="sorting">
      <select
        name="sorting"
        id="choose-sorting"
        value={sortingValue}
        onChange={handleSortingSelect}
      >
        <option value="addDate">Add date</option>
        <option value="dueDate">Due date</option>
      </select>
      {reverseOrder ? (
        <button onClick={handleOrder}>up</button>
      ) : (
        <button onClick={handleOrder}>down</button>
      )}
    </div>
  );
}

export default Sorting;
