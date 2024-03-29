import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import '../assets/styles/pick.scss';

import { useSocket } from "../hooks/socketProvider";

const SERVER = import.meta.env.VITE_BACKEND_SERVER_URL;

const $myClubs = ({ id, watching, data, onClick }) => {
    return(
        <>
            <div className={`myClub ${(watching == id) ? "watching" : ""}`} onClick={(e) => {onClick(id, e)}}>
                <h1 className="clubID">{data.id}</h1>
                <h1 className="clubName">{data.name}</h1>
            </div>
        </>
    )
};

const $applicants = ({ id, data, targ, onClick }) => {
    if (data.clubID != targ) return;
    const approved = data.approved;

    return(
        <>
            <div className={`applicant over_${data.override} ${(data.approved) ? "approved" : ""}`} onClick={() => {onClick(data.applyID, approved)}}>
                <h1 className="applicantName">{data.stuid} {data.name}</h1>
                <h1 className="applicantJimang">{(data.jimang != null) ? `${data.jimang}지망` : ""}</h1>
                <span className="material-symbols-outlined applicantInfo">info</span>
            </div>
        </>
    );
}

let _myClubs = [{}];
let _watching = 0;

let dMyApplicants = {};

function Pick(){
    const socket = useSocket();

    const [myClubs, setMyClubs] = useState([{}]);
    const [watching, setWatching] = useState(0);
    const [applicants, setApplicants] = useState([[]]);

    const [ saveState, setSaveState ] = useState(0);
    const [ saveStateMsg, setSaveStateMsg ] = useState("");

    const [ init, setInit ] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {

    }, []);

    useEffect(() => {
        if (!socket) return;
        
        if (!init) init_func();
    }, [socket]);

    async function init_func(){
        socket.on('again', () => {
            socket.emit('init');
        });

        socket.on('yourClubs', (data) => {
            setMyClubs(data);
            _myClubs = data;
            setInit(1);

            if (data.length == 0) navigate('/');
        });

        socket.on('updateClubs', data => {
            updateClubs(data);
        });

        socket.on('yourApplicants', (data) => {
            setApplicants(data);
        });

        socket.emit('init');
    }

    async function updateClubs(data){
        let flag = false;

        _myClubs.map((x, idx) => {
            if (x.id == data.clubID){
                flag = true;
                return;
            }
        });

        if (flag){
            setSaveState(0);
            setSaveStateMsg("");
            dMyApplicants = {};
        }

        if (!_myClubs[_watching].type) return;
        if (_myClubs[_watching].type == data.type){
            socket.emit("init");
            return;
        }
    }

    function handleChange(index, value, func) {
        func((prevState) => {
           return { ...prevState, ...{[index]: value}};
        });
    }

    function updateApprove(id, approved){
        let to = 1 - approved;

        if (dMyApplicants[id] != null) delete dMyApplicants[id];
        else dMyApplicants[id] = to;

        Object.entries(applicants).map(([idx, x]) => {
            if (x.applyID == id){
                let data = x;
                data.approved = to;

                handleChange(idx, data, setApplicants);

                if (Object.keys(dMyApplicants).length > 0){
                    setSaveState(1);
                    setSaveStateMsg("저장하기");
                }
                else{
                    setSaveState(0);
                    setSaveStateMsg("");
                }

                return;
            }
        });
    }

    function submitApprove(){
        if (JSON.stringify(dMyApplicants) === '{}') return;
        
        socket.emit("update", dMyApplicants);
    }

    function myClub(id, e){
        if (id == watching) return;
        
        _watching = id;
        setWatching(id);
    }

    return(
        <>
        <div id="pick">
            <div className="clubInfo">
                <h1 className="name">{myClubs[watching].name}</h1>
                <h1 className={`count ${ 
                    (myClubs[watching].currentPeople > myClubs[watching].maxPeople) ? "over" : "stable" 
                }`}>지원자 수: {myClubs[watching].currentPeople} / {myClubs[watching].maxPeople}</h1>

                <div className="applicants_wrap">
                    {Object.entries(applicants).map(([idx, data]) => <$applicants id={idx} key={idx} data={data} targ={myClubs[watching].id} onClick={updateApprove} />)}
                </div>
            </div>

            <div className="save">
                <button className={`saveData ${(saveState == 1) ? "changed" : ""}`} onClick={submitApprove}>{saveStateMsg}</button>
            </div>

            <div className="navbar">
                {myClubs.map((data, idx) => <$myClubs id={idx} key={idx} watching={watching} data={data} onClick={myClub} />)}
            </div>
        </div>
        </>
    )
}

export default Pick;
