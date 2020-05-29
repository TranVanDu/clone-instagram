import React from "react";
import { useState, useEffect } from "react";
import Preloader from "./Preloader";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

function CreatePost() {
    const history = useHistory();
    const [isLoading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("");

    useEffect(() => {
        if (url) {
            const createPost = () => {
                return fetch("/createpost", {
                    method: "post",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:
                            "Bearer " + localStorage.getItem("token"),
                    },
                    body: JSON.stringify({
                        title,
                        body,
                        photo: url,
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
                            M.toast({
                                html: "create post success",
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
            createPost();
        }
    }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

    const postDetails = () => {
        if (image.length > 0) {
            setLoading(true);
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
                .then((data) => setUrl(data.url))
                .catch((err) => {
                    M.toast({
                        html: "Create post fail!!",
                        classes: "#e53935 red darken-1",
                    });
                    setLoading(false);
                    history.push("/createpost");
                    console.log(err);
                });
        }
    };
    return (
        <div>
            {!isLoading ? (
                <div
                    className=" card input-field"
                    style={{
                        margin: "10px auto",
                        maxWidth: "500px",
                        padding: "20px",
                        textAlign: "center",
                    }}
                >
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="input-field col s12">
                        <textarea
                            id="textarea1"
                            className="materialize-textarea"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                        ></textarea>
                        <label htmlFor="textarea1">Description</label>
                    </div>
                    <div className="file-field input-field">
                        <div
                            className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                            style={{ marginTop: "0px" }}
                        >
                            <span>File</span>
                            <input
                                type="file"
                                onChange={(e) => setImage(e.target.files)}
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
                    <div
                        className=" btn waves-effect waves-light #64b5f6 blue lighten-2"
                        onClick={postDetails}
                    >
                        Submit
                    </div>
                </div>
            ) : (
                <Preloader />
            )}
        </div>
    );
}

export default CreatePost;
