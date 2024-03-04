import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import pages from './pages/pages';

import Header from "./components/header";
import { useState, useEffect } from 'react';

import "./assets/scripts/socketHandler";
import socketHandler from './assets/scripts/socketHandler';
import { SocketProvider } from './hooks/socketProvider';
import axios from "axios";

function App(){
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const title = import.meta.env.VITE_TITLE;
    const [ subtitle, setSubtitle ] = useState("");
    const [ pageID, setpageID ] = useState("");
    const [ socket, setSocket ] = useState(null);

    axios.defaults.withCredentials = false;

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
    }, [pathname] );

    useEffect(() => {
        if (pathname.startsWith("/users")) handleLogin();
        else return;
        
    }, [location, navigate]);

    async function handleLogin(){
        const searchParams = new URLSearchParams(location.search);
        const extractedstuid = searchParams.get('stuid');
        const extractedSuccessURL = searchParams.get('successURL');
        const successURL = (extractedSuccessURL && (extractedSuccessURL != "undefined" && extractedSuccessURL != 404)) ? extractedSuccessURL : "/";
        let extractedUserID;
        const extractUserID = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER_URL}userID/?stuid=${extractedstuid}`, {
            withCredentials: false
        });
        extractedUserID = extractUserID.userID;
        console.log(searchParams);
        console.log(extractedSuccessURL);
        console.log(extractUserID);
        console.log(extractedUserID);
        
        navigate(`${successURL}`);

        let _userData = {
            isLogined: true,
            data: {
                userID: extractedUserID,
                userStuid: 0,
                userName: ""
            }
        }

        const moreInfo = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER_URL}userInfo?userID=${extractedUserID}`,{
            withCredentials: false
        });

        _userData.data.userStuid = moreInfo.data.stuid;
        _userData.data.userName = moreInfo.data.name;

        setUserData(_userData);

        const socketFunc = socketHandler();
        setSocket(socketFunc);

        socketFunc.emit("login", _userData.data);
    }

    useEffect(() => {
        let { "id" : newID } = pages.find(p => p.path === pathname) || pages.find(p => p.path === "*");
        newID = (newID == "home") ? "" : newID;

        if (!pathname.startsWith("/users")){
            window.location.href=`https://iam.jshsus.kr?service=newjshsus&successURL=${newID}`;
        }
    }, []);

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