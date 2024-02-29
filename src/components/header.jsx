import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from "axios";

import "../assets/styles/header.scss";

function Header({subtitle, userData}){
    let [ _subtitle, _setSubtitle ] = useState("\u00A0: ");
    const [ cursorOption, setCursorOption ] = useState("");
    const [ loginInfo, setLoginInfo ] = useState({});
    const { pathname } = useLocation();

    function login(){
        window.location.href=`https://iam.jshsus.kr?service=newjshsus&successURL=${pathname}`;
    }

    useEffect(() => {
        
    }, [subtitle]);

    useEffect(() => {
        setLoginInfo(userData);
    }, [userData]);

    return(
        <>
            <header className="header header2" id="header">
                <div className="left_wrap">
                    <Link to="/"><img id="logo" src="https://jshsus.kr/resources/icon/lIcon.png" /></Link>
                    <Link id="header_title" className="title" to="/">{import.meta.env.VITE_TITLE}</Link>
                    <Link to="/" id="header_subtitle" className="title subtitle">
                        <span id="header_subtitle_content">{"\u00A0: " + subtitle}</span>
                        <span id="header_cursor" className={`cursor ${cursorOption}`}>|</span>
                    </Link>
                </div>

                <div className="right_wrap">
                    <a className={`login ${(loginInfo.isLogined) ? "logined" : ""}`} onClick={login}>
                        {(loginInfo.isLogined) ? `${loginInfo.data.userStuid} ${loginInfo.data.userName}` : "로그인"}
                    </a>
                    <div id="menu_icon">
                        <span className="menu_icons"></span>
                        <span className="menu_icons"></span>
                        <span className="menu_icons"></span>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;