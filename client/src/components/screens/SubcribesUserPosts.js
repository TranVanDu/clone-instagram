import React, { useState, useEffect, useContext } from "react";
import Preloader from "./Preloader";
import { UserContext } from "../../App";
import M from "materialize-css";
import { Link } from "react-router-dom";
import { Comment, Avatar } from "antd";
// import PropTypes from "prop-types";

// Home.propTypes = {};

function SubcribesUserPosts(props) {
    const [data, setData] = useState("");
    const [text, setText] = useState("");
    const [isLoading, setLoading] = useState(false);
    const { state } = useContext(UserContext);

    useEffect(() => {
        setLoading(true);
        fetch("/getsubpost", {
            method: "get",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data.posts);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const like = (id) => {
        fetch("/like", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
                postId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return { ...item, likes: result.likes };
                    } else {
                        return item;
                    }
                });

                setData(newData);
            })
            .catch((err) => {
                M.toast({
                    html: err,
                    classes: "#e53935 red darken-1",
                });
            });
    };

    const unLike = (id) => {
        fetch("/unlike", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
                postId: id,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return { ...item, likes: result.likes };
                    } else {
                        return item;
                    }
                });

                setData(newData);
            })
            .catch((err) => {
                M.toast({
                    html: err,
                    classes: "#e53935 red darken-1",
                });
            });
    };

    const makeComment = (text, postId) => {
        fetch("/comment", {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({
                text,
                postId,
            }),
        })
            .then((res) => res.json())
            .then((result) => {
                const newData = data.map((item) => {
                    if (item._id === result._id) {
                        return result;
                    } else {
                        return item;
                    }
                });

                setData(newData);
            })
            .catch((err) => console.log(err));
    };

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((result) => {
                const newData = data.filter((item) => {
                    return item._id !== result._id;
                });
                setData(newData);
                M.toast({
                    html: "delete post success",
                    classes: "#2e7d32 green darken-3",
                });
            })
            .catch((err) => console.log(err));
    };
    return (
        <div>
            {!isLoading ? (
                <div className="home">
                    {data.length ? (
                        data.map((item, index) => (
                            <div key={index} className="card home-card">
                                <h5 className="home-title">
                                    <Avatar
                                        style={{ marginRight: "5px" }}
                                        src={item.postedBy.pic}
                                        alt="avatar"
                                    />
                                    <Link
                                        to={
                                            item.postedBy._id !== state._id
                                                ? "/profile/" +
                                                  item.postedBy._id
                                                : "/profile"
                                        }
                                    >
                                        {item.postedBy.name}
                                    </Link>
                                    {item.postedBy._id === state._id ? (
                                        <i
                                            className="material-icons"
                                            style={{
                                                color: "red",
                                                cursor: "pointer",
                                                float: "right",
                                            }}
                                            onClick={() => deletePost(item._id)}
                                        >
                                            delete
                                        </i>
                                    ) : (
                                        <i
                                            className="material-icons"
                                            style={{
                                                color: "#ddd",
                                                float: "right",
                                            }}
                                        >
                                            delete
                                        </i>
                                    )}
                                </h5>
                                <div className="car-image">
                                    <img
                                        style={{
                                            width: "100%",
                                        }}
                                        src={item.photo}
                                        alt={item.title}
                                    />
                                </div>
                                <div className="card-content">
                                    {item.likes.includes(state._id) ? (
                                        <i
                                            className="material-icons"
                                            style={{
                                                color: "red",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => unLike(item._id)}
                                        >
                                            favorite
                                        </i>
                                    ) : (
                                        <i
                                            className="material-icons"
                                            style={{
                                                color: "#ddd",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => like(item._id)}
                                        >
                                            favorite
                                        </i>
                                    )}
                                    <span>{item.likes.length} likes</span>
                                    <h6>{item.title}</h6>
                                    <p>{item.body}</p>
                                    <hr />
                                    <div style={{ marginTop: "10px" }}>
                                        {item.comments.map((record, index) => {
                                            return (
                                                <Comment
                                                    key={index}
                                                    // actions={[
                                                    //     <span key="comment-nested-reply-to">
                                                    //         Reply to
                                                    //     </span>,
                                                    // ]}
                                                    author={
                                                        // <Link>
                                                        //     {
                                                        //         record.postedBy
                                                        //             .name
                                                        //     }
                                                        // </Link>
                                                        <Link
                                                            to={
                                                                record.postedBy
                                                                    ._id !==
                                                                state._id
                                                                    ? "/profile/" +
                                                                      record
                                                                          .postedBy
                                                                          ._id
                                                                    : "/profile"
                                                            }
                                                        >
                                                            {item.postedBy.name}
                                                        </Link>
                                                    }
                                                    avatar={
                                                        <Avatar
                                                            src={
                                                                record.postedBy
                                                                    .pic
                                                            }
                                                            alt="Han Solo"
                                                        />
                                                    }
                                                    content={
                                                        <p>{record.text}</p>
                                                    }
                                                ></Comment>
                                            );
                                        })}
                                    </div>
                                    <form
                                        onSubmit={(e) => {
                                            console.log(item.poste);
                                            e.preventDefault();
                                            makeComment(
                                                e.target[0].value,
                                                item._id
                                            );
                                            setText("");
                                        }}
                                    >
                                        <input
                                            type="text"
                                            style={{ borderBottom: "none" }}
                                            placeholder="add a comment"
                                            value={text}
                                            onChange={(e) => {
                                                setText(e.target.value);
                                            }}
                                        />
                                    </form>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <h2>No posts!!!</h2>
                        </div>
                    )}
                </div>
            ) : (
                <Preloader />
            )}
        </div>
    );
}

export default SubcribesUserPosts;
