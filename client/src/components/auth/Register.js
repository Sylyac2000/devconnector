import React, {Fragment, useState} from "react";
import axios from "axios";
import {connect} from "react-redux";
import {setAlert} from "../../redux/actions/alert";

const Register = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });
    //destructuring
    const { name, email, password, password2 } = formData
    const handleChange = (e)=> {
        e.preventDefault();
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleSubmit = async(e)=> {
        e.preventDefault();
        if(password !== password2) {
            props.setAlert("passwords don't much", 'danger');
        }
        else {
            console.log(formData);
            const newUser = { name, email, password};
            //this will be done in redux
            try {
                const config = {
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
                const body = JSON.stringify(newUser);

                const res = await axios.post('/api/users', body, config);
                console.log(res.data)
                
            } catch (err) {
                console.error(err.response);
            }
        }
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
                <form className="form" onSubmit={(event)=>handleSubmit(event)}>
                    <div className="form-group">
                        <input type="text" placeholder="Name" name="name" value={name} onChange={(e)=>handleChange(e)} required/>
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email Address" name="email" value={email} onChange={(e)=>handleChange(e)}/>
                        <small className="form-text"
                        >This site uses Gravatar so if you want a profile image, use a
                            Gravatar email</small
                        >
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            minLength="6"
                            value={password}
                            onChange={(e)=>handleChange(e)}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="password2"
                            minLength="6"
                            value={password2}
                            onChange={(e)=>handleChange(e)}
                        />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Register"/>
                </form>
                <p className="my-1">
                    Already have an account? <a href="login.html">Sign In</a>
                </p>
            </section>
        </Fragment>
    );
};

export default connect(null, {setAlert})(Register);