import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default function CreateOrder() {
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you can submit the order with the selected date
    // You can access the selected date using the 'selectedDate' state variable
    // Send a request to the server to create the order with the selected date

    try {
      await axios.post("http://localhost:8080/api/order", {
        dateOfDelivery: selectedDate,
      }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt-token")}`
          }
      });

      navigate("/"); // Redirect to the orders page after successful order creation
    } catch (error) {
      console.log("Error creating order:", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Create Order</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="date" className="form-label">
                Date
              </label>
              <br />
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                minDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Minimum date is tomorrow
                dateFormat="yyyy-MM-dd"
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Submit
            </button>
            <Link className="btn btn-outline-danger mx-2" to="/">
              Cancel
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}