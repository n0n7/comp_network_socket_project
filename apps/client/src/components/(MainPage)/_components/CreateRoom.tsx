import React from "react";

type Props = {};

export default function ({}: Props) {
    return (
        <div>
            <div className="flex">
                <input type="text" placeholder="Room name" />
                <button>Create</button>
            </div>
        </div>
    );
}
