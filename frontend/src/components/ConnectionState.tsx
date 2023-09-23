import React from "react";

function Status({props} : {props: Boolean}) {
    return (
        <p>
            The value is: {props.toString()}
        </p>
    )
}

export default Status;