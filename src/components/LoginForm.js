import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import styled from "styled-components";

const formSchema = yup.object().shape({
  email: yup
    .string()
    .email("Must be a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password is too short"),
});

const LoginForm = () => {
  const history = useHistory();

  const [formState, setFormState] = useState({
    email: "",
    password: "",
  });

  const [errorState, setErrorState] = useState({
    email: "",
    password: "",
  });

  const validate = (event) => {
    event.persist();
    yup
      .reach(formSchema, event.target.name)
      .validate(event.target.value)
      .then((valid) => {
        setErrorState({
          ...errorState,
          [event.target.name]: "",
        });
      })
      .catch((error) => {
        console.log(error.errors);
        setErrorState({
          ...errorState,
          [event.target.name]: error.errors[0],
        });
      });
  };

  const formSubmit = (event) => {
    event.preventDefault();
    axios
      .post("https://how-to1.herokuapp.com/api/users/login", formState)
      .then((response) => {
        console.log(response);

        localStorage.setItem('token', response.data.token)
        history.push("/howto-form")
      })

      .catch((error) => console.log(error));
  };
  console.log("I was rendered");
  const inputChange = (event) => {
    setFormState({
      ...formState,
      [event.target.name]: event.target.value,
    });
    validate(event);
  };

  return (
    <LoginCard>
      <form onSubmit={formSubmit}>
        <label htmlFor="email">Email: </label>
        <input
          id="email"
          type="text"
          name="email"
          value={formState.email}
          onChange={inputChange}
        />
        {errorState.email.length > 0 ? <p>{errorState.email}</p> : null}
        <label htmlFor="password"> Password: </label>
        <input
          id="password"
          type="password"
          name="password"
          value={formState.password}
          onChange={inputChange}
        />
        {errorState.password.length > 0 ? <p>{errorState.password}</p> : null}
        <button>Login</button>
      </form>
    </LoginCard>
  );
};

export default LoginForm;

const LoginCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  margin-top: 20px;
  padding: 10px;
  background-color: lightgray;
  border: 0.3rem solid gray;

  @media (max-width: 700px) {
    display: flex;
    flex-direction: column;
    max-width: 400px;

    input {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  input {
    border: 0.1rem solid orange;
  }
`;
