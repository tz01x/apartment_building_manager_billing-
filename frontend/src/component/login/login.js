import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { userLogin } from "../../slice/user-slices";
import { useNavigate } from "react-router-dom";
const initialFrom = {
  username: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [fromValue, setFormValue] = useState(initialFrom);
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    setFormValue((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const onClickHandler = (e) => {
    // dispatch login
    e.preventDefault();
    dispatch(userLogin(fromValue))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((e) => e);
  };

  return (
    <div>
      <form>
        <div>
          <label htmlFor="id_username">Username </label>
          <input
            id="id_username"
            type="text"
            name="username"
            autoComplete="username"
            onChange={onChangeHandler}
            value={fromValue.username}
          />
        </div>
        <div>
          <label htmlFor="id_password">password </label>
          <input
            id="id_password"
            type="password"
            name="password"
            autoComplete="current-password"
            onChange={onChangeHandler}
            value={fromValue.password}
          />
        </div>
        <input type={"submit"} value="login" onClick={onClickHandler} />
      </form>
    </div>
  );
};

export default Login;
