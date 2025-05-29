import React from "react";
import { getUsersByPage, getUserCount, deleteUser, searchUserByEmail } from "../../lib/firebase/users";
import DataTable from "../../components/DataTable";
import { timeFormat } from "../../lib/utils";

const Users = () => {
    return (
        <DataTable
            fetchData={getUsersByPage}
            fetchCount={getUserCount}
            searchAction={searchUserByEmail}
            searchPlaceholder="Search user email..."
            searchType="lowercase"
            deleteAction={deleteUser}
            hasPagination
            columns={[
                { id: "Nama", header: "Nama" },
                { id: "Email", header: "Email" },
                { id: "Role", header: "Role" },
                {
                    id: "collection",
                    header: "Collection",
                    cell: ({ row }) => {
                        const calculateCollection = (collection) => {
                            if (!Array.isArray(collection)) {
                                const mappedCollection = Object.keys(collection).map((key) => collection[key]);
                                return mappedCollection.filter((c) => c).length;
                            }
                            return collection.filter((c) => c).length;
                        };
                        return <p>{row.original.collection ? calculateCollection(row.original.collection) : 0}</p>;
                    },
                },
                {
                    id: "points",
                    header: "Points",
                    cell: ({ row }) => {
                        const { quiz } = row.original;
                        if (!quiz) return <p>0</p>;

                        const totalPoints = Object.values(quiz).reduce((acc, curr) => acc + curr, 0);
                        return <p>{totalPoints}</p>;
                    },
                },
                {
                    id: "lastLoggedIn",
                    header: "Last Login",
                    cell: ({ row }) => <p>{row.original.lastLoggedIn ? timeFormat("id", row.original.lastLoggedIn) : "-"}</p>,
                },
            ]}
            confirmationMessage={`Are you sure you want to delete this user?`}
        />
    );
};

export default Users;
