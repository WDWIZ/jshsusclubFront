import { useState, useEffect } from 'react';
import axios from "axios";

import '../assets/styles/club.scss';

const $clubLists = ({ id, data }) => {
    return(
        <>
            <div className="clubs_type">
                <h1 className="clubs_type_header"><span className="material-symbols-outlined micon">{data.typeIcon}</span>&nbsp;{data.typeTitle}</h1>

                <ul>
                    {data.clubs.map((_data, idx) =>
                        <li key={"c" + idx} className="clubs">
                            {idx + 1}. {data.clubs[idx].name} ({data.clubs[idx].Leader.stuid} {data.clubs[idx].Leader.name})
                        </li>
                    )}
                </ul>
            </div>
        </>
    );
}

function Club(){
    const [ clubLists, setClubLists ] = useState([]);
    axios.defaults.withCredentials = false;

    useEffect(() => {
        axios({
            "method" : "get",
            "url" : import.meta.env.VITE_BACKEND_SERVER_URL + "clubs/clubs"
        }).then(res => {
            setClubLists(res.data);
        });
    }, []);

    return(
        <>
            <div id="club">
                <div id="list_wrap">
                    <ul>
                        {clubLists.map((data, idx) => <$clubLists id={idx} key={idx} data={data} />)}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Club;