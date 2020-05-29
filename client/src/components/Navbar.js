import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
import "../assets/styles/nav.css";
//import PropTypes from "prop-types";

// Navbar.propTypes = {};

function Navbar(props) {
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    const renderList = () => {
        if (state) {
            return [
                <li key={0}>
                    <Link to="/profile">Profile</Link>
                </li>,
                <li key={1}>
                    <Link to="/createpost">Create Post</Link>
                </li>,
                <li key={3}>
                    <Link to="/myfollowingpost">Follow</Link>
                </li>,
                <li key={2}>
                    <button
                        className="btn waves-effect waves-light #e53935 red darken-1"
                        style={{
                            marginTop: "0px",
                            marginRight: "20px",
                        }}
                        onClick={() => {
                            localStorage.clear();
                            dispatch({ type: "CLEAR" });
                            M.toast({
                                html: "Logout sucess",
                                classes: "#e53935 red darken-1",
                            });
                            history.push("/signin");
                        }}
                    >
                        Logout
                    </button>
                </li>,
            ];
        } else {
            return [
                <li key={3}>
                    <Link to="/signin">Login</Link>
                </li>,
                <li key={4}>
                    <Link to="/signup">Signup</Link>
                </li>,
            ];
        }
    };
    return (
        <nav>
            <div className="nav-wrapper" style={{ backgroundColor: "#fff" }}>
                <Link to={state ? "/" : "/signin"} className="brand-logo left">
                    Instagram
                </Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
