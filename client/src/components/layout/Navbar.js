import React from 'react';
import {Link} from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to=''><i className="fas fa-code"></i> DevConnector</Link>

            </h1>
            <ul>
                <li><a href="profiles.html">Developers</a></li>
                <li><a href="register.html">Register</a></li>
                <li><a href="login.html">Login</a></li>
                <Link to='/register'>Register</Link>
                <Link to='/login'>Login</Link>
            </ul>
        </nav>
    );
}

export default Navbar;