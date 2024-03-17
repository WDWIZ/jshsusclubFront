import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import Header from "./components/header";
import pages from './pages/pages';

import { useState, useEffect } from 'react';

import "./assets/scripts/socketHandler";
import socketHandler from './assets/scripts/socketHandler';
import { SocketProvider } from './hooks/socketProvider';
import axios from "axios";

const levelInfo = {
    0: "applicant",
    1: "leader",
    2: "admin"
}

function App(){
    const { pathname } = useLocation();
    const navigate = useNavigate();
    
    const title = import.meta.env.VITE_TITLE;
    const [ subtitle, setSubtitle ] = useState("");
    const [ pageID, setpageID ] = useState("");
    
    const [ socket, setSocket ] = useState(null);

    const [ isLogined, setIsLogined ] = useState(false);
    const [ userData, setUserData ] = useState({
        isLogined: false,
        data: {}
    });

    useEffect(() => {
        const { "subtitle" : newSubtitle } = pages.find(p => p.path === pathname) || pages.find(p => p.path === "*");
        const { "id" : newID } = pages.find(p => p.path === pathname) || pages.find(p => p.path === "*");
        setSubtitle(newSubtitle);
        setpageID((newID == "home") ? "" : newID);

        document.title = title + ' : ' + newSubtitle;
    }, [pathname]);

    useEffect(() => {
        let { "id" : newID } = pages.find(p => p.path === pathname) || pages.find(p => p.path === "*");
        newID = (newID == "home") ? "" : newID;

        if (!pathname.startsWith("/users")){
            window.location.href=`https://iam.jshsus.kr?service=newjshsustest&successURL=${newID}`;
        }
    }, []);    

    useEffect(() => {
        if (pathname.startsWith("/users")) handleLogin();
        else return;
        
    }, [location, navigate]);

    async function handleLogin(){
        const searchParams = new URLSearchParams(location.search);
        const extractedAccessKey = searchParams.get('accessKey');
        const extractedSuccessURL = searchParams.get('successURL');
        const successURL = (extractedSuccessURL && (extractedSuccessURL != "undefined" && extractedSuccessURL != 404)) ? extractedSuccessURL : "/";
        
        navigate(`${successURL}`);

        let _userData = {
            isLogined: true,
            data: {
                stuid: 0,
                name: "",
                level: 0
            }
        }

        const moreInfo = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER_URL}/userInfo?accessKey=${extractedAccessKey}`, {
            withCredentials: false
        });

        _userData.data.stuid = moreInfo.data.stuid;
        _userData.data.name = moreInfo.data.name;
        _userData.data.level = moreInfo.data.level;

        setUserData(_userData);

        const socketFunc = socketHandler(levelInfo[moreInfo.data.level]);
        setSocket(socketFunc);

        socketFunc.emit("login", _userData.data);
    }

    return(
        <>
            <Header subtitle={subtitle} userData={userData} />
            <SocketProvider socket={socket}>
                <Routes>
                    { pages.map(p => <Route key={p.id} path={p.path} element={<p.comp />}/>) }
                </Routes>
            </SocketProvider>
        </>
    );
}

export default App;