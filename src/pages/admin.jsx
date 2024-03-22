import { useState, useEffect } from "react";
import axios from "axios";

import { Link, useLocation } from "react-router-dom";
import { useSocket } from "../hooks/socketProvider";

import '../assets/styles/admin.scss';

const SERVER = import.meta.env.VITE_BACKEND_SERVER_URL;

let _userData;

function Admin(){
    return(
        <>
        <div id="admin">
            
        </div>
        </>
    );
}

export default Admin;