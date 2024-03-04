import { NavLink, useNavigate } from 'react-router-dom';
import '../assets/styles/home.scss';
import { useState, useEffect } from 'react';
import { useSocket } from "../hooks/socketProvider";

const $sendToAdmission = ({ id, name, onClick }) => {
    return(
        <>
            <h1 className="sendToAdmission" onClick={() => {onClick(id, name)}}>{`${id}. ${name} 신입생 모집`}</h1>
        </>
    )
}

function Home(){
    const [ myClubs, setMyClubs ] = useState([]);
    const socket = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        if (!socket) return;

        socket.emit('myClubs');

        socket.on('yourClubs', (data) => {
            setMyClubs(data);
        });
    
        return () => {
            socket.off('yourClubs');
        };
    }, [socket]);

    const handleNavigateToAdmission = (clubID, clubName) => {
        navigate('/admission', { state: {id: clubID, name: clubName} });
    };

    return(
        <>
            <div id="home">
                <div id="links">
                    <div id="sendToAdmission">
                        <h1 className="admissionTitle">이거 뭐였는지 기억안남.</h1>
                        {myClubs.map((data, idx) => <$sendToAdmission id={data.id} key={"sta" + idx} name={data.name} onClick={handleNavigateToAdmission} />)}
                    </div>

                    <div className="linkbox">
                        <NavLink className="link" to="/clubs">동아리 리스트</NavLink>
                    </div>
                </div>

                <div id="info">
                    <h1>
                        Made By WDWIZ {'{'}IDBI{'}'}, Blight Studioz {'{'}IDBI{'}'}<br/>
                        With Jshsus<br/>
                        Software Responsibility (SO) : WDWIZ {'{'}IDBI{'}'} , Blight Stduioz {'{'}IDBI{'}'}, IDBI UNION</h1>
                </div>
            </div>
        </>
    )
}

export default Home;