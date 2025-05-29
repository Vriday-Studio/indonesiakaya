import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import { deleteQuiz, getAllQuiz, getQuizCount } from "../../lib/firebase/quiz";
import { getAllArtworks } from "../../lib/firebase/artwork";

const Quiz = () => {
    const [listAssets, setListAssets] = useState([]);

    const getListAssets = async () => {
        const assets = await getAllArtworks();
        setListAssets(assets);
    };

    useEffect(() => {
        getListAssets();
    }, []);

    return (
        <>
            <DataTable
                fetchData={getAllQuiz}
                fetchCount={getQuizCount}
                deleteAction={(id) => deleteQuiz(id)}
                confirmationMessage={`Are you sure you want to delete this data?`}
                columns={[
                    { id: "title", header: "Title" },
                    {
                        id: "artworkTitle",
                        header: "Artwork",
                        cell: ({ row }) => <p>{listAssets.find((asset) => asset.id === row.original.artworkId)?.title}</p>,
                    },
                    { id: "questionCount", header: "Question Count", cell: ({ row }) => <p>{row.original.questions.length}</p> },
                    {
                        id: "totalPoint",
                        header: "Total Point",
                    },
                ]}
                userList
            />

            {/* <div className="px-10 flex flex-col gap-4">
                <div>
                    <label className="label">
                        <span className="label-text font-semibold">Minimal Point to Claim Regular</span>
                    </label>
                    <input
                        type="number"
                        value={minimalPoint.regular}
                        onChange={(e) => setMinimalPoint((prev) => ({ ...prev, regular: e.target.value }))}
                        className="input input-bordered"
                        placeholder="Enter minimal point"
                    />
                </div>
                <div>
                    <label className="label">
                        <span className="label-text font-semibold">Minimal Point to Claim Exclusive</span>
                    </label>
                    <input
                        type="number"
                        value={minimalPoint.exclusive}
                        onChange={(e) => setMinimalPoint((prev) => ({ ...prev, exclusive: e.target.value }))}
                        className="input input-bordered"
                        placeholder="Enter minimal point"
                    />
                    {message && <p className="text-green-900 mt-2">{message}</p>}
                </div>
                <div>
                    <button onClick={handleSetMinimalPoint} className="btn btn-info btn-outline">
                        {isLoading ? <Loading /> : "Set"}
                    </button>
                </div>
            </div> */}
        </>
    );
};

export default Quiz;
