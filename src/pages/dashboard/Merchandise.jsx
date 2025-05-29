import React, { useState } from "react";
import { deleteMerchandise, getAllMerchandise, getMerchandiseCount } from "../../lib/firebase/merchandise";
import DataTable from "../../components/DataTable";
import ModalMerchandise from "../../components/ModalMerchandise";

const ButtonAddData = () => {
    return (
        <button className="btn" onClick={() => document.getElementById("add_data").showModal()}>
            Add Data
        </button>
    );
};

const Merchandise = () => {
    const [isRefetch, setIsRefetch] = useState(false);
    const [selectedMerchandise, setSelectedMerchandise] = useState(null);

    const editButton = (selectedMerchandise) => {
        return (
            <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => {
                    setSelectedMerchandise(selectedMerchandise);
                    document.getElementById("add_data").showModal();
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 64 64">
                    <path
                        fill="none"
                        stroke="#000"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeMiterlimit="10"
                        strokeWidth="2"
                        d="M45.17,15.426L21.936,41.787c0,0,4.628,2.745,5.777,6.191c5.234-6.383,25.851-29.872,25.851-29.872	c4.117-4.404-5.745-14.362-11.362-8.426c-5.617,6.128-26.011,29.745-26.011,29.745l-3.415,15.83L20.149,52	c0,0-1.197-3.878-7.372-5.17"
                    ></path>
                </svg>
            </button>
        );
    };
    return (
        <>
            <DataTable
                fetchData={getAllMerchandise}
                isRefetch={isRefetch}
                fetchCount={getMerchandiseCount}
                deleteAction={(id) => deleteMerchandise(id)}
                confirmationMessage={`Are you sure you want to delete this data?`}
                canAddData={false}
                canEditData={false}
                customEditData={editButton}
                columns={[
                    { id: "name", header: "Name" },
                    {
                        id: "type",
                        header: "Tipe",
                    },
                ]}
                customAddData={<ButtonAddData />}
            />
            <ModalMerchandise setIsRefetch={setIsRefetch} selectedMerchandise={selectedMerchandise} setSelectedMerchandise={setSelectedMerchandise} />
        </>
    );
};

export default Merchandise;
