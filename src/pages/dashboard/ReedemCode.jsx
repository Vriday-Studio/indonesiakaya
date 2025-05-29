import React from "react";
import DataTable from "../../components/DataTable";
import { deleteRedeemCode, getRedeemByPage, getRedeemCodeCount, searchRedeemCode, updateRedeemCode } from "../../lib/firebase/redeemCode";
import { timeFormat } from "../../lib/utils";
import ModalSelectMerchandise from "../../components/ModalSelectMerchandise";
import ModalRedeemSettings from "../../components/ModalRedeemSettings";

const ButtonSettingRedeem = () => {
    return (
        <button className="btn mx-10" onClick={() => document.getElementById("set_redeem").showModal()}>
            Redeem Setting
        </button>
    );
};

const RedeemCode = () => {
    const [isRefetch, setIsRefetch] = React.useState(false);

    const buttonClaim = (row) => {
        return (
            <>
                <button className="btn btn-success" onClick={() => document.getElementById("add_merchandise").showModal()}>
                    Claim
                </button>
                <ModalSelectMerchandise redeemCode={row} setIsRefetch={setIsRefetch} />
            </>
        );
    };
    return (
        <>
            <DataTable
                canAddData={false}
                fetchData={getRedeemByPage}
                fetchCount={getRedeemCodeCount}
                hasPagination
                deleteAction={(id) => deleteRedeemCode(id)}
                searchAction={searchRedeemCode}
                searchType="uppercase"
                searchPlaceholder="Search redeem code..."
                confirmationMessage={`Are you sure you want to delete this data?`}
                columns={[
                    {
                        id: "action",
                        header: "Action",
                        cell: ({ row }) => (row.original.status ? <p>Claimed</p> : buttonClaim(row.original)),
                    },
                    {
                        id: "merchandise",
                        header: "Merchandise",
                    },
                    { id: "id", header: "Redeem Code" },
                    { id: "type", header: "Tipe" },
                    { id: "user.Email", header: "User", cell: ({ row }) => row.original.user.Email },
                    { id: "createdAt", header: "Created At", cell: ({ row }) => <p>{timeFormat("id", row.original.createdAt)}</p> },
                ]}
                userList
                hideAction
                isRefetch={isRefetch}
            />
            <ModalRedeemSettings />
            <ButtonSettingRedeem />
        </>
    );
};

export default RedeemCode;
