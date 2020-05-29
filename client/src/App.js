import React, { useEffect, createContext, useReducer, useContext } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useHistory,
} from "react-router-dom";
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Signup from "./components/screens/Signup";
import Profile from "./components/screens/Profile";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import SubcribesUserPosts from "./components/screens/SubcribesUserPosts";
import { reducer, INITIAL_STATE } from "./reducers/userReducer";
import "antd/dist/antd.css";

export const UserContext = createContext();

const Routing = () => {
    const history = useHistory();
    const { dispatch } = useContext(UserContext);
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            dispatch({ type: "USER", payload: user });
            history.push("/");
        } else {
            history.push("/signin");
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <Switch>
            <Route exact path="/">
                <Home />
            </Route>
            <Route path="/signup">
                <Signup />
            </Route>
            <Route path="/signin">
                <Login />
            </Route>
            <Route exact path="/profile">
                <Profile />
            </Route>
            <Route path="/createpost">
                <CreatePost />
            </Route>
            <Route path="/profile/:userid">
                <UserProfile />
            </Route>
            <Route path="/myfollowingpost">
                <SubcribesUserPosts />
            </Route>
        </Switch>
    );
};

function App() {
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
    return (
        <UserContext.Provider value={{ state, dispatch }}>
            <Router>
                <Navbar />
                <Routing />
            </Router>
        </UserContext.Provider>
    );
}

export default App;
