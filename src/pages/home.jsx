import { NavLink, useNavigate } from 'react-router-dom';
import '../assets/styles/home.scss';
import { useState, useEffect } from 'react';
import { useSocket } from "../hooks/socketProvider";

const TITLE = import.meta.env.VITE_TITLE;

const links = [
    {
        title: "",
        path: ""
    },

    {
        title: "동아리 신청하기 (1학년)",
        path: "/apply"
    },

    {
        title: "내 동아리 관리 (짱)",
        path: "/pick"
    },

    {
        title: "시스템 관리 (관리자)",
        path: "/admin"
    }
]

const $serviceLink = ({ level }) => {
    return(
        <NavLink to={`${links[level].path}`} className="serviceLink">{`${links[level].title}`}</NavLink>
    );
}

function Home(){
    const socket = useSocket();
    const [ userLevel, setUserLevel ] = useState(0);
    const [ init, setInit ] = useState(0);

    useEffect(() => {
        if (!socket) return;

        if (!init){
            socket.on('again', (data) => {
                socket.emit('levelCheck');
            });

            socket.on("yourLevel", async (data) => {
                if (data == null) setUserLevel(0);
                else setUserLevel(data + 1);
                setInit(1);
            });

            socket.emit("levelCheck");
        }
    }, [socket]);

    return(
        <>
        <div id="home">
            <div className="landing">
                <h1 className="title">{TITLE}</h1>
                <h1 className="subtitle">동아리</h1>
            </div>

            <div className="serviceTo">
                <$serviceLink level={userLevel} key="serviceLink" />
            </div>

            <div className="serviceInfo">
                <h1>Made By WDWIZ {'{'}IDBI{'}'}, Blight Studioz {'{'}IDBI{'}'}<br/>
                    With Jshsus<br/>
                    Software Responsibility (SR): WDWIZ {'{'}IDBI{'}'} , Blight Stduioz {'{'}IDBI{'}'}, IDBI UNION<br/>
                    Powered By: Jshsus (iam.jshsus.kr), CloudType, Netlify</h1>
            </div>
        </div>
        </>
    )
}

export default Home;