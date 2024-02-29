import { useState, useEffect } from "react";
import axios from "axios";

import { Link, useLocation } from "react-router-dom";

import '../assets/styles/admission.scss';

let MyClubApplicants = [];

function convertTZ(_date, tzString) {
    const date = new Date((typeof _date === "string" ? new Date(_date) : _date).toLocaleString("en-US", {timeZone: tzString}));

    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return `${month} ${day}, ${time}`;
}

const $clubs = ({ id, onClick, data, myClub }) => {
    return(
        <>
            <div className="clubs_type">
                <h1 className="clubs_type_header"><span className="material-symbols-outlined micon">{data.typeIcon}</span>&nbsp;{data.typeTitle}</h1>

                <ul>
                    {data.clubs.map((_data, idx) =>
                        <li key={"c" + idx} className={"clubs " + ((data.clubs[idx].id === myClub) ? "myClub" : "")} onClick={() => {onClick(data.clubs[idx].id)}}>
                            {idx + 1}. {data.clubs[idx].name} ({data.clubs[idx].Leader.stuid} {data.clubs[idx].Leader.name})
                        </li>
                    )}
                </ul>
            </div>
        </>
    )
};

const $applicants = ({ id, data, onClick, myClubApplicants }) => {
    let inClub = myClubApplicants.includes(id);

    return(
        <>
            <div className={"applicants " + (inClub ? "myClub" : "")} onClick={() => onClick.modalBox(id)}>
                <h1 className="applicants_info">{data.stuid} {data.name}</h1>
                <h2 className="applicants_pick" onClick={(e) => onClick.pick(id, (inClub ? "remove" : "add"), e)}>
                    <span className="material-symbols-outlined">{inClub ? "close" : "check"}</span>
                </h2>
            </div>
        </>
    );
};

function Admission(){
    const [ clubsList, setClubsList ] = useState([]);
    const [ applicantsList, setApplicantsList ] = useState([]);

    const [ showApplicantsInfo, setShowApplicantsInfo ] = useState(false);
    const [ showClubInfo, setShowClubInfo ] = useState(false);
    const [ myClub, setMyClub ] = useState({});
    const [ myClubApplicants, setMyClubApplicants ] = useState([]);

    const [ modalBoxInfo, setModalBoxInfo ] = useState({
        applicantInfo: [
            {name: "", stuid: ""}
        ],
        joinedClub: [
            {}
        ]
    });

    const [ clubInfo, setClubInfo ] = useState({
        clubInfo: {},
        joinedApplicants: []
    });

    const location = useLocation();
    const isMyClub = location.state;

    if (!isMyClub){
        return (
            <div id="error">
                <h2>No club data available Sry :(</h2>
                <Link to="/">Go Back to Home</Link>
            </div>
        );
    }

    useEffect(() => {
        setMyClub(isMyClub);

        axios({
            "method": "get",
            "url": import.meta.env.VITE_BACKEND_SERVER_URL + "clubs/clubs"
        }).then(res => {
            setClubsList(res.data);
        });

        axios({
            "method": "get",
            "url": import.meta.env.VITE_BACKEND_SERVER_URL + "clubs/applicants"
        }).then(res => {
            setApplicantsList(res.data);
        });

        axios.get(`${import.meta.env.VITE_BACKEND_SERVER_URL}clubs/applicantsClub/${isMyClub.id}`).then((res) => {
            setMyClubApplicants(res.data);
        });
    }, []);

    async function ShowmodalBox(id){
        axios.get(`${import.meta.env.VITE_BACKEND_SERVER_URL}clubs/applicantInfo/${id}`).then((res) => {
            setModalBoxInfo(res.data);
        });

        setShowApplicantsInfo(true);
    }

    async function ShowClubInfo(id){
        axios.get(`${import.meta.env.VITE_BACKEND_SERVER_URL}clubs/clubInfo/${id}`).then((res) => {
            setClubInfo(res.data);
            console.log(res.data);
        });

        setShowClubInfo(true);
    }

    async function pick(id, mode, e){
        e.stopPropagation();

        const data = {
            clubID: myClub.id,
            applicantID: id
        }

        await axios.post(`${import.meta.env.VITE_BACKEND_SERVER_URL}clubs/pick/${mode}`, data);
        await axios.get(`${import.meta.env.VITE_BACKEND_SERVER_URL}clubs/applicantsClub/${myClub.id}`).then((res) => {
            setMyClubApplicants(res.data);
        });
    }

    function HidemodalBox(e){
        setShowApplicantsInfo(false);
    }

    function HandlemodalBox(e){
        e.stopPropagation();
    }

    function HideClubInfo(e){
        setShowClubInfo(false);
    }

    function HandleclubInfo(e){
        e.stopPropagation();
    }
    
    return(
        <>
            <div id="adms">
                <div id="clubsLists">
                    <div className="clubsLists_wrap">
                        <h1 id="clubsLists_header">동아리 목록</h1>

                        <div id="clubs_wrap">
                            {clubsList.map((data, idx) => <$clubs id={idx} key={"cb" + idx} data={data} myClub={myClub.id} onClick={ShowClubInfo} />)}
                        </div>
                    </div>
                </div>

                <div id="applicantsLists">
                    <div className="applicantsLists_wrap">
                        <h1 id="applicantsLists_header">학생 목록 ({`${myClub.name}로 보는 중`})</h1>

                        <div id="applicants_wrap">
                            {applicantsList.map((data, idx) => <$applicants id={data.id} key={idx} data={data} onClick={{modalBox : ShowmodalBox, pick: pick}} myClubApplicants={myClubApplicants} />)}
                        </div>
                    </div>
                </div>
            </div>

            <div id="applicantsInfo" className={showApplicantsInfo ? "onDisplay" : ""} onClick={HidemodalBox}>
                <div className="modalBox" onClick={HandlemodalBox}>
                    <h1 id="closeModalBox" onClick={HidemodalBox}><span className="material-symbols-outlined">close</span></h1>
                    <h1 id="modalBox_applicantInfo">{modalBoxInfo.applicantInfo[0].stuid} {modalBoxInfo.applicantInfo[0].name}</h1>

                    <div id="modalBox_joinedClub">
                        {modalBoxInfo.joinedClub.map((data, idx) => {
                            return(
                                <div key={idx} className="modalBox_joinedClubLists">
                                    <h1 className="clubName">{data.name}</h1>
                                    <h1 className="clubJoinedAt">{(data.createdAt) ? convertTZ(data.createdAt, "Asia/Seoul") : ""}</h1>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div id="clubInfo" className={showClubInfo ? "onDisplay" : ""} onClick={HideClubInfo}>
                <div className="modalBox" onClick={HandleclubInfo}>
                    <h1 id="closeModalBox" onClick={HideClubInfo}><span className="material-symbols-outlined">close</span></h1>
                    <h1 id="clubInfoName">{clubInfo.clubInfo.clubName}</h1>
                    <h1 id="clubInfoLeaders">
                        짱 : {clubInfo.clubInfo.leaderStuid} {clubInfo.clubInfo.leaderName}<br/>
                        부짱 : {(clubInfo.clubInfo.subleaderStuid) ? `${clubInfo.clubInfo.subleaderStuid} ${clubInfo.clubInfo.subleaderName}` : "없음"}
                    </h1>

                    <div id="clubInfo_people">
                        {clubInfo.joinedApplicants.map((data, idx) => {
                            return(
                                <div key={idx} className="clubInfo_applicants">
                                    <h1 className="applicantName">{data.stuid} {data.name}</h1>
                                    <h1 className="clubJoinedAt">{(data.createdAt) ? convertTZ(data.createdAt, "Asia/Seoul") : ""}</h1>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Admission;