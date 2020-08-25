import React from 'react';
import { Link } from 'react-router-dom';

import { logoutAsync } from './AuthSlice';

export const Logout = () => <Link to='/' className="nav-link" onClick={logoutAsync}>Logout</Link>;
