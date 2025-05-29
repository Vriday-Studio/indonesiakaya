import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSelectedArtwork } from "../../lib/firebase/artwork";
import { Table } from "../../components/Table";
import BackIcon from "../../components/BackIcon";
import { timeFormat } from "../../lib/utils";

const ArtworkListUser = () => {
    const params = useParams();
    const [user, setUser] = useState([]);
    const [title, setTitle] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [type, setType] = useState("user");

    const getDetail = async (id) => {
        try {
            const content = await getSelectedArtwork(id);
            setTitle(content.title);
            const sortedUsers = Object.values(content.users).sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));
            const sortedScanLog = Object.values(content.scanLog).sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));
            setUser(type === "user" ? sortedUsers : sortedScanLog);
            setIsLoading(false);
        } catch (error) {
            console.log("Error getting content setting by id: ", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getDetail(params.id);
    }, [type]);

    const CONFIG = {
        log: {
            btnLabel: "Lihat User",
            typeValue: "user",
            title: `Log Scan Artwork ${title}`,
            data: user,
        },
        user: {
            btnLabel: "Lihat Log",
            typeValue: "log",
            title: `List User Artwork ${title}`,
            data: user,
        },
    }

    return (
        <div className="p-5">
            <BackIcon />
            <h1 className="text-2xl font-bold mb-5">{CONFIG[type].title}</h1>
            <button className="btn" onClick={() => setType(CONFIG[type].typeValue)}>{CONFIG[type].btnLabel}</button>
            <Table
                cols={[
                    { id: "Nama", header: "Nama" },
                    { id: "Email", header: "Email" },
                    { id: "scannedAt", header: "Last Scanned At", cell: ({row}) => <p>{timeFormat("id",row.original.scannedAt)}</p> },
                ]}
                data={user}
                loading={isLoading}
                rowCount={user.length}
                hideAction
            />
        </div>
    );
};

export default ArtworkListUser;
