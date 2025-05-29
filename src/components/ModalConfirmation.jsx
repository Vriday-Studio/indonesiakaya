import React, { forwardRef } from "react";

const ModalConfirmation = forwardRef(({ message, onConfirm, onCancel }, ref) => {
    return (
        <dialog ref={ref} className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={onCancel}
                    >
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg">Confirm</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <button className="btn" onClick={onConfirm}>
                        Yes
                    </button>
                    <button className="btn" onClick={onCancel}>
                        No
                    </button>
                </div>
            </div>
        </dialog>
    );
});

export default ModalConfirmation;
