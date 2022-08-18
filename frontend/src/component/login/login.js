import "bootstrap/dist/css/bootstrap.min.css";
import { useState ,useEffect} from "react";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  InputWrapper,
  Input,
  PasswordInput,
  Button,
  Container,
  Alert,
} from "@mantine/core";
import { AlertCircle } from "tabler-icons-react";

import { userLogin } from "../../slice/user-slices";

const initialFrom = {
  username: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const [fromValue, setFormValue] = useState(initialFrom);
  const [fromError, setFromError] = useState(initialFrom);
  const [showAlert, setShowAlert] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onChangeHandler = (e) => {
    setFormValue((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };
  const onClickHandler = (e) => {
    setFromError({ ...initialFrom });
    // dispatch login
    e.preventDefault();
    dispatch(userLogin(fromValue))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((e) => {
        const { password, username, detail } = e;
        if (detail) {
          setFromError({
            password: "Invalid password",
            username: "Invalid Username",
          });
        } else {
          setFromError({ password, username });
        }
        setShowAlert(true);
      });
  };


    useEffect(() => {
      // console.log(user.access);
    if (user.access!=="") {
      navigate("/home");
    } 
  }, [user]);

  return (
    <Container size="xs">
      <div className="mx-5">
        <h1 className="my-3">/Login</h1>
        {showAlert && (
          <Alert
            withCloseButton
            icon={<AlertCircle size={16} />}
            title="Bummer!"
            color="red"
            variant="filled"
            closeButtonLabel="Close alert"
            onClose={(e) => {
              setShowAlert(false);
            }}
          >
            Something terrible happened! You made a mistake and there is no
            going back, your data was lost forever!
          </Alert>
        )}
        <form className="my-3" onSubmit={onClickHandler}>
          <div>
            <InputWrapper
              id="id_username"
              required
              label="Username"
              error={fromError.username}
            >
              <Input
                id="id_username"
                name="username"
                autoComplete="username"
                onChange={onChangeHandler}
                value={fromValue.username}
                placeholder="name"
                type="text"
                required
              />
            </InputWrapper>
          </div>
          <div>
            <PasswordInput
              placeholder="Password"
              label="Password"
              description="Password must include at least one letter, number and special character"
              radius="md"
              name="password"
              autoComplete="current-password"
              onChange={onChangeHandler}
              value={fromValue.password}
              error={fromError.password}
              required
            />
          </div>
          <div className="mt-3">
            <Button type={"submit"} color="green" size="sm">
              Login
            </Button>
          </div>
        </form>
      </div>
    </Container>
  );
};

export default Login;
