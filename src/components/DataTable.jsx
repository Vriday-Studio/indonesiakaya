import React, { useEffect, useState, useRef } from "react";
import { Table } from "./Table";
import ModalConfirmation from "./ModalConfirmation";
import { usePagination } from "../lib/usePagination";
import { Link, useLocation } from "react-router-dom";

const DataTable = ({
    fetchData,
    fetchCount,
    searchAction,
    searchPlaceholder,
    columns,
    deleteAction,
    userList,
    confirmationMessage,
    isRefetch,
    customAddData,
    canAddData = true,
    canEditData = true,
    customEditData,
    hideAction = false,
    hasPagination = false,
    searchType = "default",
}) => {
    const [data, setData] = useState([]);
    const [rowCount, setRowCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const modalRef = useRef(null);
    const { onPaginationChange, pagination } = usePagination();
    const location = useLocation();

    const handleDelete = (item) => {
        setSelectedItem(item);
        modalRef.current.showModal();
    };

    const confirmDelete = async () => {
        if (deleteAction && selectedItem) {
            await deleteAction(selectedItem.id);
            fetchDataAndCount();
        }
        modalRef.current.close();
    };

    const fetchDataAndCount = async () => {
        const totalCount = await fetchCount();
        const items = totalCount > 0 ? await fetchData(pagination.pageSize) : [];
        setRowCount(totalCount);
        setData(items);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchDataAndCount();
    }, [pagination, location, isRefetch]);

    const handleSearch = async () => {
        if (searchTerm.trim() === "") {
            fetchDataAndCount(); // Reset data ketika search term kosong
        } else {
            setIsLoading(true);
            const results = await searchAction(searchTerm); // Panggil function pencarian
            if (results) {
                setData([results]);
                setIsLoading(false);
            } else {
                setData([]);
                setIsLoading(false);
            }
        }
    };

    const SEARCH_CONFIG = {
        uppercase: {
            className: "uppercase",
            onChange: (e) => setSearchTerm(e.target.value.toUpperCase()),
        },
        lowercase: {
            className: "lowercase",
            onChange: (e) => setSearchTerm(e.target.value.toLowerCase()),
        },
        default: {
            className: "",
            onChange: (e) => setSearchTerm(e.target.value),
        },
    };

    return (
        <div className="p-10">
            {canAddData && !customAddData && (
                <Link to={`${location.pathname}/create`} className="btn">
                    Add Data
                </Link>
            )}
            {customAddData && customAddData}

            {searchAction && (
                <div className="flex gap-2 my-4">
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        className={`${SEARCH_CONFIG[searchType].className} input input-bordered w-full`}
                        value={searchTerm}
                        onChange={SEARCH_CONFIG[searchType].onChange}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSearch();
                            }
                        }}
                    />
                    <button className="btn" onClick={handleSearch}>
                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 50 50">
                            <path d="M 21 3 C 11.601563 3 4 10.601563 4 20 C 4 29.398438 11.601563 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601563 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z" />
                        </svg>
                    </button>
                </div>
            )}

            <Table
                cols={columns}
                data={data}
                loading={isLoading}
                onPaginationChange={onPaginationChange}
                rowCount={rowCount}
                pagination={pagination}
                hasPagination={hasPagination}
                handleDelete={handleDelete}
                deleteAction={deleteAction}
                canEditData={canEditData}
                customEditData={customEditData}
                userList={userList}
                hideAction={hideAction}
            />

            {deleteAction && (
                <ModalConfirmation ref={modalRef} message={confirmationMessage} onConfirm={confirmDelete} onCancel={() => modalRef.current.close()} />
            )}
        </div>
    );
};

export default DataTable;
