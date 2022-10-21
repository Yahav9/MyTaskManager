// import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";

import Card from "../../../shared/components/Card/Card"

function ListItem(props) {

    return (
        <li>
            <Card>
                <Link to={`/${props.user}/${props.id}`}>
                    <div>{props.name}</div>
                </Link>
                <div>
                    <i className="material-icons"
                    // onClick={deleteHandler}
                    >
                        delete
                    </i>
                    <i className="material-icons">edit</i>
                </div>
            </Card>
        </li>
    )
}

export default ListItem;