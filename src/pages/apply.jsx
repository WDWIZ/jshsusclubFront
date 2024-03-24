import { useState, useEffect } from "react";
import axios from "axios";

import { Link, useLocation } from "react-router-dom";
import { useSocket } from "../hooks/socketProvider";

import '../assets/styles/apply.scss';

const SERVER = import.meta.env.VITE_BACKEND_SERVER_URL;

const $clubTypes = ({ id, watching, data, onClick }) => {
    return(
        <>
            <div className={`clubType ${(watching == id) ? "watching" : ""}`} onClick={(e) => {onClick(id, e)}}>
                <h1 className="typeID">{data.id}</h1>
                <h1 className="typeName">{data.type}</h1>
                <span className="material-symbols-outlined typeIcon">{data.icon}</span>
            </div>
        </>
    )
};

const $apply = ({id, data, jMode, approveInfo, onClick}) => {
    const club = data;
    const applyInfo = approveInfo[data.id] || {approved: false, applied: false, applyInfo: {}};
    const match = ((jMode == null) || (jMode + 1 == applyInfo.applyInfo.jimang));

    return(
        <>
            <div className={`apply ${(applyInfo.approved ? "approved" : "")} ${((applyInfo.applied) ? ((match) ? "applied" : "applied subapplied") : "")}`} onClick={() => {onClick(data.id, jMode, applyInfo)}}>
                <h1 className="clubName">{club.name}</h1>
                {(applyInfo.applied && match) ? <h1 className="isApproved">{(applyInfo.approved) ? "승인됨" : "대기중"}</h1> : ""}
            </div>
        </>
    );
}

const $applyClubs = ({wdata, jwatching, watching, onClick, approveInfo}) => {
    if (wdata[0].length == 0) return;
    const clubs = wdata[watching].clubs;
    const maxCount = wdata[watching].maxCount;
    const jMode = (maxCount != null) ? jwatching : null;

    const option = Array.from(Array(maxCount || 0), () => Array(0).fill(0));

    return(
        <>
            <div className={`jimang ${(maxCount) ? "" : "hide"}`}>
                <h1 className="jheader">(지망 선택)</h1>
                {option.map((data, idx) => 
                    <div key={idx} className={`box ${(jwatching == idx) ? "jwatching" : ""}`} onClick={() => {onClick.j(idx)}}>{idx + 1}</div>
                )}
            </div>   

            <div className="wrap">
                {clubs.map((data, idx) => <$apply id={idx} key={idx} jMode={jMode} data={data} onClick={onClick.apply} approveInfo={approveInfo} />)}
            </div>
        </>
    );
}

let _userData;

function Apply(){
    const socket = useSocket();

    const [userData, setUserData] = useState({});

    const [applied, setApplied] = useState([]);
    const [approved, setApproved] = useState([]);

    const [clubData, setClubData] = useState([[]]);
    const [rawClubData, setRawClubData] = useState([]);
    const [clubTypes, setClubTypes] = useState([{type: ""}]);

    const [ watching, setWatching ] = useState(0);
    const [ jwatching, setJWatching ] = useState(0);

    const [ init, setInit ] = useState(0);
    const [ doIt, setDoIt ] = useState(true);

    axios.defaults.withCredentials = false;

    useEffect(() => {
        if (init) return;

        axios.get(`${SERVER}/clubs/types`).then(res => {
            setClubTypes(res.data);
        });

        axios.get(`${SERVER}/clubs/ordered`).then(res => {
            setClubData(res.data);
        });

        axios.get(`${SERVER}/clubs`).then(res => {
            setRawClubData(res.data);
        });
    }, [init]);

    useEffect(() => {
        if (!socket) return;
        
        if (!init) init_func();
    }, [socket]);

    async function init_func(){
        socket.on('again', (data) => {
            socket.emit('init');
        });

        socket.on('updateApply', data => {
            console.log(data);
            if (data.includes(_userData.id)){
                setDoIt(true);
                socket.emit('myApply');
            }
        });

        socket.on('yourApply', data => {
            setApplied(data);
            setInit(1);
        });

        socket.on('yourUserData', data => {
            setUserData(data);
            _userData = data;
        });

        socket.emit('init');
    }

    useEffect(() => {
        setApproved(checkApplyInfo(applied));
    }, [applied]);

    function clubType(id, e){
        if (id == watching) return;
        setJWatching(0);
        
        setWatching(id);
    }

    function JWatching(id){
        if (id == jwatching) return;

        setJWatching(id);
    }

    function checkApplyInfo(data){
        let result = {applied: true, approved: false, applyInfo: {}};

        let arr = {};

        data.map((_data, idx) => {
            result = {applied: true, approved: _data.approved, applyInfo: _data}
            
            arr[_data.clubID] = result;
        });
        
        return arr;
    }

    function updateApply(clubID, jimang, data){
        if (!doIt) return;
        
        let flag = true;

        applied.map((x, idx) => {
            if (jimang != null){
                if (x.type == watching + 1 && x.jimang == jimang + 1){
                    if (x.clubID != clubID) flag = false;
                }
                else if (x.clubID == clubID) flag = false;
            }
        });

        if (!flag) return;

        data.jimang = jimang;
        data.clubID = clubID;

        setDoIt(false);

        socket.emit("update", data);
    }

    return(
        <>
        <div id="apply">
            <div className="userInfo">
                <h1 className="name">{userData.stuid} {userData.name}</h1>
            </div>

            <div className="applyClub">
                <h1 className="header">{clubTypes[watching].type} <span className="maxPick">{(clubTypes[watching].option) ? `(최대 ${clubTypes[watching].option} 택)` : ""}</span></h1>

                <$applyClubs wdata={clubData} watching={watching} jwatching={jwatching} onClick={{apply: updateApply, j: JWatching}} approveInfo={approved} />
            </div>

            <div className="navbar">
                {clubTypes.map((data, idx) => <$clubTypes id={idx} key={idx} watching={watching} data={data} onClick={clubType} />)}
            </div>
        </div>
        </>
    )
}

export default Apply;
