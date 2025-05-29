import React from "react";
import { getContentSettingByTag, getContentSettingCount } from "../../lib/firebase/contentSetting";
import DataTable from "../../components/DataTable";
import { useParams } from "react-router-dom";
import { filterStringFromHtmlTag } from "../../lib/utils";

const ContentSetting = () => {
    const params = useParams();
    const tag = params.tag;

    return (
        <DataTable
            fetchData={() => getContentSettingByTag(tag, "desc", false)}
            fetchCount={() => getContentSettingCount(tag)}
            confirmationMessage={`Are you sure you want to delete this data?`}
            columns={[
                { id: "title", header: "Title" },
                { id: "description", header: "Description", cell: ({ row }) => filterStringFromHtmlTag(row.original.description) },
                { id: "tag", header: "Tag" },
                { id: "status", header: "Status", cell: ({ row }) => (row.original.status ? "Published" : "Not Published") },
                {
                    id: "images",
                    header: "Images",
                    cell: ({ row }) =>
                        row.original.images &&
                        row.original.images.length && (
                            <div className="flex gap-2">
                                {row.original.images.map((image, index) => (
                                    <img key={index} src={image} alt={`Content`} className="w-24 h-24 object-cover" />
                                ))}
                            </div>
                        ),
                },
            ]}
        />
    );
};

export default ContentSetting;
