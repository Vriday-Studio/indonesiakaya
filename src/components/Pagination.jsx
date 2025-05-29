import React from "react";

export const Pagination = ({ tableLib, sizes, rowCount }) => (
    <footer className="join my-5">
        <div className="space-x-3 leading-10">
            <span>Show: </span>
            <select
                className="select select-bordered"
                value={tableLib.getState().pageSize}
                onChange={(e) => tableLib.setPageSize(parseInt(e.target.value, 10))}
            >
                {sizes.map((size) => (
                    <option key={size} value={size}>
                        {size}
                    </option>
                ))}
            </select>
            <span>items per page from total <strong>{rowCount}</strong> items</span>
        </div>
    </footer>
);
