import React, {useState} from 'react';
import axios from "axios";

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    //destructuring
    const { email, password} = formData
    const handleChange = (e)=> {
        e.preventDefault();
        setFormData({...formData, [e.target.name]: e.target.value});
    }
    const handleSubmit = async(e)=> {
        e.preventDefault();
        if(password === '' && email === '') {
            console.log("password requis");
            console.log("email requis");
        }
        else {
            console.log(formData);
            const newUser = { email, password};
            //this will be done in redux
            try {
                const config = {
                    headers: {
                        'Content-type': 'application/json'
                    }
                }
                const body = JSON.stringify(newUser);

                /*const res = await axios.post('/api/users', body, config);
                console.log(res.data)*/

            } catch (err) {
                console.error(err.response);
            }
        }
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    return (
        <section className="container">
            <div className="alert alert-danger">
                Invalid credentials
            </div>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" onSubmit={(event)=>handleSubmit(event)}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={(e)=>{handleChange(e)}}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password} onChange={(e)=>handleChange(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Login"/>
            </form>
            <p className="my-1">
                Don't have an account? <a href="register.html">Sign Up</a>
            </p>
        </section>
    );
};

export default Login;