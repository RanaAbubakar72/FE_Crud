import React, { useState, useEffect } from "react";
import "./App.css";
import { ReactComponent as DeleteIcon } from "./components/Delete.svg";
import { ReactComponent as Editicon } from "./components/Edit.svg";
import mongoose from "mongoose";

function App() {
  const [data, setData] = useState([]);
  const [newId, setNewId] = useState("");
  console.log(newId);
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    password: "",
  });
  const handelonchange = (e) => {
    setFormdata({ ...formdata, [e.target.id]: e.target.value });
  };

  const savedata = async (e) => {
    e.preventDefault();
    const payload = {
      _id: new mongoose.Types.ObjectId(),
      username: formdata.name,
      email: formdata.email,
      password: formdata.password,
    };
    // console.log(payload);
    const api = "http://localhost:5000/submit";
    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setData([...data, payload]);
        setFormdata({
          name: "",
          email: "",
          password: "",
        });
      } else {
        console.error("Failed to save data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // edit request
  const updatedata = async (e) => {
    e.preventDefault();
    const payload = {
      _id: newId,
      username: formdata.name,
      email: formdata.email,
      password: formdata.password,
    };
    // console.log(payload);
    const api = "http://localhost:5000/update";
    try {
      const response = await fetch(api, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setData(
          data.map((item) =>
            item._id === newId
              ? {
                  ...item,
                  username: payload.username,
                  email: payload.email,
                  password: payload.password,
                }
              : item
          )
        );

        setFormdata({
          name: "",
          email: "",
          password: "",
        });
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleted = async () => {
    const api = "http://localhost:5000/deleteall";
    try {
      await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setData([]);
    } catch (error) {
      console.error(error);
    }
  };

  //delete one request
  const deleteOne = async (id) => {
    const api = "http://localhost:5000/deleteone";
    try {
      await fetch(api, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      // setData([])
      setData(data.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  //edit one
  const handleEditClick = async (id) => {
    console.log(id);

    setNewId(id);
    const edit = data.find((data) => id === data._id);
    console.log(edit);
    setFormdata({
      name: edit.username,
      email: edit.email,
      password: edit.password,
    });
  };

  const getdata = async () => {
    const api = "http://localhost:5000/getdata";
    try {
      const response = await fetch(api, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      // console.log(result);
      setData(result);
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getdata();
  }, []);

  return (
    <>
      <form className="container form my-3">
        <h1>LOGIN</h1>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="email"
            className="form-control"
            onChange={handelonchange}
            id="name"
            value={formdata.name}
            autoComplete="false"
            placeholder="Enter Name"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            onChange={handelonchange}
            id="email"
            value={formdata.email}
            autoComplete="false"
            placeholder="Enter email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={formdata.password}
            onChange={handelonchange}
            autoComplete="false"
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary my-2 mx-2"
          onClick={savedata}
        >
          Submit
        </button>

        <button
          type="submit"
          className="btn btn-primary my-2 mx-2"
          onClick={updatedata}
        >
          Update
        </button>
      </form>
      <div className="container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
              <th scope="col"></th>
              <th scope="col">
                <DeleteIcon onClick={deleted} />{" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.map((item, index) => {
              return (
                <tr key={index}>
                  <th>{index + 1}</th>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.password}</td>
                  <td>
                    <Editicon onClick={() => handleEditClick(item._id)} />
                  </td>
                  <td>
                    <DeleteIcon onClick={() => deleteOne(item._id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
