import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

import axios from "axios";
import moment from "moment";

import accessKey from "~shared/scripts/accessKey.js";
import { getData, postData, putData } from "~shared/scripts/getData.js";

import DataTable from "~shared/ui/datatable";
import MySwal from "~shared/ui/sweetalert";

import "./index.scss";

import { Card, Button, Dropdown } from "react-bootstrap";

const TITLE = import.meta.env.VITE_TITLE;

function AdminApplications() {
    const [tableData, setTableData] = useState([]);
    const [columns, setColumns] = useState([]);

    const dataRef = useRef();

    const [optionList, setOptionList] = useState([
        { data: "창체", view: true },
        { data: "학술", view: true },
        { data: "공학", view: true },
        { data: "축제", view: true },
        { data: "체육", view: true },
        { data: "위원회", view: true },
        { data: "기타", view: true },
    ]);

    useEffect(() => {
        init();
    }, []);

    async function init() {
        const sessionID = await accessKey();
        const data = await getData("https://points.jshsus.kr/api/clubs/admin/applications", {sessionID});

        dataRef.current = data;
        setupTable(data);
    }

    function setupTable(data) {
        if (!data) return;

        const dataList = data.map((x) => {
            const { id, name, stuid, clubName, createdAt, isApproved } = x;

            return [
                id,
                clubName,
                `${name} (${stuid})`,
                stuid,
                moment(createdAt).format("YYYY-MM-DD HH:mm:ss"),
                1,
                isApproved ? "O" : "X"
            ];
        });

        setTableData(dataList);
        setColumns([
            { data: "ID" },
            { data: "동아리 이름" },
            { data: "지원자", orderBase: 3 },
            { hidden: true },
            { data: "지원 날짜" },
            { hidden: true },
            { data: "합격 여부" },
        ]);
    }

    // function removeHandler(applyId, isApproved) {
    //   const newStatus = isApproved ? 0 : 1;
    //   const actionText = isApproved ? "합격 취소" : "합격 처리";

    //   MySwal.fire({
    //     title: `${actionText} 하시겠습니까?`,
    //     text: `이 지원자를 ${actionText}합니다.`,
    //     icon: "question",
    //     showCancelButton: true,
    //     confirmButtonColor: "#3085d6",
    //     cancelButtonColor: "#d33",
    //     confirmButtonText: actionText,
    //     cancelButtonText: "취소",
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       axios
    //         .put(`https://points.jshsus.kr/api/clubs/applications/${applyId}`, {
    //           isApproved: newStatus,
    //         })
    //         .then((result) => {
    //           console.log(result);
    //           init();
    //           MySwal.fire({
    //             icon: "success",
    //             title: `${actionText} 완료!`,
    //             text: `지원자가 ${actionText}되었습니다.`,
    //           }).then(() => {
    //             // 새로고침 (F5와 같은 효과)
    //             // window.location.reload();
    //           });
    //         })
    //         .catch((error) => {
    //           console.log(error);
    //           MySwal.fire({
    //             icon: "error",
    //             title: "오류 발생",
    //             text: "상태 변경 중 오류가 발생했습니다.",
    //           });
    //         });
    //     }
    //   });
    // }

    function optionHandler(e) {
        e.stopPropagation();
    }

    function optionSelect(e, idx, list) {
        e = e || window.event;

        const arr = [...list];
        arr[idx].view = !arr[idx].view;

        const finalData = dataRef.current.filter((data) => {
        const { type } = data;

        return arr[type - 1].view;
        });

        setOptionList(arr);
        setupTable(finalData);
    }

    return (
        <>
        <div id="apply">
            <Card>
            <Card.Header>
                <Card.Title>내 신청내역</Card.Title>
            </Card.Header>
            <Card.Body>
                <div className="tableWrap">
                <Card.Text className="label">내 신청내역 조회</Card.Text>
                <DataTable
                    className="applyTable"
                    columns={columns}
                    data={tableData}
                    order={[0, "desc"]}
                    options={{
                    language: {
                        search: "통합 검색: ",
                    },
                    }}
                />
                </div>
            </Card.Body>
            </Card>
        </div>
        </>
    );
}

export default AdminApplications;
