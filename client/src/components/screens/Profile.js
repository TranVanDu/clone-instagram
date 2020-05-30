import React, { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../App";
import Preloader from "./Preloader";
import { Modal, Button } from "antd";
import M from "materialize-css";
// import PropTypes from "prop-types";

// Profile.propTypes = {};

function Profile(props) {
    const imageInputRef = useRef();
    const [mypics, setMypics] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [loading, setLoad] = useState(false);
    const { state, dispatch } = useContext(UserContext);
    const [visible, setVisible] = useState(false);
    const [url, setUrl] = useState(undefined);
    const [image, setImage] = useState(null);
    const defaultAvatart =
        "https://images.unsplash.com/photo-1561470341-7d67ff1cdf9d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60";
    useEffect(() => {
        setLoading(true);
        const myPost = () => {
            return fetch("/mypost", {
                method: "get",
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setMypics(data.myPosts);
                    setLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                    // setLoading(false);
                });
        };
        myPost();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (url) {
            fetch("/updatepic", {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    pic: url,
                }),
            })
                .then((res) => res.json())
                .then((result) => {
                    localStorage.setItem(
                        "user",
                        JSON.stringify({ ...state, pic: result.pic })
                    );
                    dispatch({
                        type: "UPDATE_PIC",
                        payload: result.pic,
                    });
                    handleCancel();
                    M.toast({
                        html: "Update avatar sucesss",
                        classes: "#2e7d32 green darken-3",
                    });
                    //window.location.reload()
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [url]); // eslint-disable-line react-hooks/exhaustive-deps
    const modal = () => {
        setVisible(true);
    };
    const handleCancel = () => {
        imageInputRef.current.value = null;
        setImage(null);
        setVisible(false);
        setLoad(false);
    };
    const handleOk = (e) => {
        e.preventDefault();
        updatePhoto();
    };

    const updatePhoto = () => {
        if (image.length > 0) {
            setLoad(true);
            const formData = new FormData();
            for (let i = 0; i < image.length; i++) {
                formData.append("file", image[i]);
            }
            formData.append("upload_preset", "instagram-clone");
            formData.append("cloud_name", "clonedata");
            fetch("	https://api.cloudinary.com/v1_1/clonedata/image/upload", {
                method: "post",
                body: formData,
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setUrl(data.url);
                    imageInputRef.current.value = null;
                    setImage(null);
                    setVisible(false);
                })
                .catch((err) => {
                    M.toast({
                        html: "Update fail!!",
                        classes: "#e53935 red darken-1",
                    });
                    setLoad(false);
                    console.log(err);
                });
        }
    };

    return (
        <div>
            {!isLoading ? (
                <div
                    style={{
                        maxWidth: "750px",
                        margin: "0px auto",
                    }}
                >
                    <div className="profile">
                        <div
                            style={{
                                display: "flex",
                                position: "relative",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <img
                                className="profile-avatar"
                                src={
                                    state
                                        ? state.pic
                                            ? state.pic
                                            : defaultAvatart
                                        : defaultAvatart
                                }
                                alt="avatar"
                            />
                            <button className="btn-avatar" onClick={modal}>
                                Change
                            </button>
                        </div>
                        <div className="profile-details">
                            <h5>{state ? state.name : null}</h5>
                            <h6>{state ? state.email : null}</h6>
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                }}
                            >
                                <span className="mr-2">
                                    {mypics.length} posts
                                </span>
                                <span className="mr-2">
                                    {state ? state.followers.length : 0}{" "}
                                    followers
                                </span>
                                <span className="mr-2">
                                    {state ? state.following.length : 0}{" "}
                                    following
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="galley">
                        {mypics
                            ? mypics.map((item, index) => (
                                  <img
                                      key={index}
                                      className="item"
                                      src={item.photo}
                                      alt={item.title}
                                  />
                              ))
                            : null}
                    </div>
                    <Modal
                        title="Change Avatar"
                        visible={visible}
                        onOk={handleOk}
                        onCancel={() => handleCancel()}
                        footer={[
                            <Button key="back" onClick={() => handleCancel()}>
                                Huỷ
                            </Button>,
                            <Button
                                loading={loading}
                                key="submit"
                                type="primary"
                                onClick={(e) => handleOk(e)}
                            >
                                Submit
                            </Button>,
                        ]}
                    >
                        <div className="file-field input-field">
                            <div
                                className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                                style={{ marginTop: "0px" }}
                            >
                                <span>Upload</span>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        setImage(e.target.files);
                                    }}
                                    ref={imageInputRef}
                                />
                            </div>
                            <div className="file-path-wrapper">
                                <input
                                    className="file-path validate"
                                    type="text"
                                    placeholder="Upload one or more files"
                                />
                            </div>
                        </div>
                    </Modal>
                </div>
            ) : (
                <Preloader />
            )}
        </div>
    );
}

export default Profile;
