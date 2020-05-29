import React from "react";
import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import Preloader from "./Preloader";

function Signup() {
    const history = useHistory();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState("");
    const [isloading, setLoading] = useState(false);
    const [url, setUrl] = useState(undefined);

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url]); // eslint-disable-line react-hooks/exhaustive-deps

    const uploadPic = () => {
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
                    history.push("/signup");
                    console.log(err);
                });
        }
    };

    const uploadFields = () => {
        console.log(url);
        setLoading(true);
        if (
            // eslint-disable-next-line
            !/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
                email
            )
        ) {
            M.toast({ html: "invalid email", classes: "#e53935 red darken-1" });
            setLoading(false);
            return;
        }
        fetch("/signup", {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                password,
                email,
                pic: url,
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
                        html: data.message,
                        classes: "#2e7d32 green darken-3",
                    });
                    history.push("/signin");
                }
            })
            .catch((error) => {
                setLoading(false);
                M.toast({ html: error, classes: "#e53935 red darken-1" });
            });
    };

    const PostData = () => {
        if (image) {
            uploadPic();
        } else {
            uploadFields();
        }
    };
    return (
        <div>
            {!isloading ? (
                <div className="mycard">
                    <div className="card auth-card input-field">
                        <h2>Instagram</h2>
                        <input
                            type="text"
                            placeholder="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <div className="file-field input-field">
                            <div
                                className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                                style={{ marginTop: "0px" }}
                            >
                                <span>Upload</span>
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

                        <button
                            className="btn waves-effect waves-light #64b5f6 blue lighten-2"
                            onClick={PostData}
                        >
                            login
                        </button>
                        <h5>
                            <Link to="/signin">Already have an account?</Link>
                        </h5>
                    </div>
                </div>
            ) : (
                <Preloader />
            )}
        </div>
    );
}

export default Signup;
