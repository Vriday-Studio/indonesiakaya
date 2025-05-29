import React from "react";
import { getAllArtworks, getArtworkCount } from "../../lib/firebase/artwork";
import DataTable from "../../components/DataTable";
import { filterStringFromHtmlTag } from "../../lib/utils";

const Artwork = () => {
    return (
        <DataTable
            fetchData={getAllArtworks}
            fetchCount={getArtworkCount}
            columns={[
                {
                    id: "image",
                    header: "Image",
                    cell: ({ row }) => <img src={row.original.image} alt={`Content`} className="w-24 h-24 object-cover" />,
                },
                { id: "title", header: "Title" },
                { id: "usersCount", header: "Users Count" },
                { id: "description", header: "Description", cell: ({ row }) => filterStringFromHtmlTag(row.original.description) },
                { id: "index", header: "Compiler Target Index", cell: ({ row }) => `${row.original.startAtIndex} - ${row.original.endAtIndex}` },
                { id: "area", header: "Area" },
                { id: "material", header: "Material" },
                { id: "year", header: "Year" },
                { id: "media", header: "Media" },
                { id: "size", header: "Size" },
                { id: "status", header: "Status", cell: ({ row }) => (row.original.status ? "Published" : "Draft") },
            ]}
            userList
        />
    );
};

export default Artwork;
