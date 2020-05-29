/* eslint-disable */
import React from "react";
import { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import Preloader from "./Preloader";
import { UserContext } from "../../App";

function Login() {
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {
        setLoading(true);
        if (
            // eslint-disable-next-line
            !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
                email
            )
        ) {
            M.toast({
                html: "invalid email",
                classes: "#e53935 red darken-1",
            });
            setLoading(false);
            return;
        }

        fetch("/signin", {
            method: "post",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setLoading(false);
                if (data.error) {
                    M.toast({
                        html: data.error,
                        classes: "#e53935 red darken-1",
                    });
                } else {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    dispatch({
                        type: "USER",
                        payload: data.user,
                    });
                    M.toast({
                        html: "login success",
                        classes: "#2e7d32 green darken-3",
                    });
                    history.push("/");
                }
            })
            .catch((err) => {
                setLoading(false);
                M.toast({
                    html: err,
                    classes: "#e53935 red darken-1",
                });
            });
    };

    return (
        <div>
            {!isLoading ? (
                <div className="mycard">
                    <div className="card auth-card input-field">
                        <h2>Instagram</h2>
                        <input
                            type="text"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                            onClick={login}
                        >
                            login
                        </button>
                        <h5>
                            <Link to="/signup">Dont have an account?</Link>
                        </h5>
                    </div>
                </div>
            ) : (
                <Preloader />
            )}
        </div>
    );
}

export default Login;
