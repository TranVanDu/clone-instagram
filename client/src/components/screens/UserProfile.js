import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import Preloader from "./Preloader";
import { useParams } from "react-router-dom";

function UserProfile(props) {
    const [userProfile, setProfile] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const { state, dispatch } = useContext(UserContext);
    const { userid } = useParams();
    // const [showFollow, setShowFollow] = useState(true);
    const [showFollow, setShowFollow] = useState(
        state ? !state.following.includes(userid) : true
    );
    const defaultAv =
        "https://images.unsplash.com/photo-1561470341-7d67ff1cdf9d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60";

    useEffect(() => {
        setLoading(true);
        const userProfile = () => {
            return fetch(`/user/${userid}`, {
                method: "get",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setProfile(data);
                    setLoading(false);
                    // if (state) {
                    //     let check = null;
                    //     check = data.user.followers.find(
                    //         (item) => item === state._id
                    //     );
                    //     if (check) {
                    //         setShowFollow(false);
                    //     }
                    // }
                })
                .catch((err) => {
                    console.log(err);
                    // setLoading(false);
                });
        };
        userProfile();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const follower = () => {
        fetch("/follow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
                followId: userid,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        followers: result.followers,
                        following: result.following,
                    },
                });
                localStorage.setItem("user", JSON.stringify(result));
                setProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [
                                ...prevState.user.followers,
                                result._id,
                            ],
                        },
                    };
                });
                setShowFollow(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const unfolow = () => {
        fetch("/unfollow", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
                followId: userid,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        following: data.following,
                        followers: data.followers,
                    },
                });
                localStorage.setItem("user", JSON.stringify(data));

                setProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(
                        (item) => item !== data._id
                    );
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower,
                        },
                    };
                });
                setShowFollow(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    return (
        <div>
            {!isLoading ? (
                userProfile ? (
                    <div
                        style={{
                            maxWidth: "750px",
                            margin: "0px auto",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                margin: "18px 5px",
                                borderBottom: "1px solid #ddd",
                            }}
                        >
                            <div>
                                <img
                                    className="profile-avatar"
                                    src={
                                        userProfile.user.pic
                                            ? userProfile.user.pic
                                            : defaultAv
                                    }
                                    alt="avatar"
                                />
                            </div>
                            <div>
                                <div style={{ display: "flex" }}>
                                    <h5>{userProfile.user.name}</h5>
                                    {showFollow ? (
                                        <button
                                            style={{
                                                marginTop: "15px",
                                                marginLeft: "10px",
                                                fontSize: "10px",
                                                padding: "0px 10px",
                                            }}
                                            className="btn  #64b5f6 blue lighten-2"
                                            onClick={follower}
                                        >
                                            follow
                                        </button>
                                    ) : (
                                        <button
                                            style={{
                                                marginTop: "15px",
                                                marginLeft: "10px",
                                                fontSize: "10px",
                                                padding: "0px 10px",
                                            }}
                                            className="btn  #64b5f6 blue lighten-2"
                                            onClick={unfolow}
                                        >
                                            unfollow
                                        </button>
                                    )}
                                </div>
                                <h6>{userProfile.user.email}</h6>
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <span className="mr-2">
                                        {userProfile.posts.length} posts
                                    </span>
                                    <span className="mr-2">
                                        {userProfile.user.followers.length}{" "}
                                        followers
                                    </span>
                                    <span className="mr-2">
                                        {userProfile.user.following.length}{" "}
                                        following
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="galley">
                            {userProfile.posts.length > 0
                                ? userProfile.posts.map((item, index) => (
                                      <img
                                          key={index}
                                          className="item"
                                          src={item.photo}
                                          alt={item.title}
                                      />
                                  ))
                                : null}
                        </div>
                    </div>
                ) : (
                    <div>Not Found</div>
                )
            ) : (
                <Preloader />
            )}
        </div>
    );
}

export default UserProfile;
