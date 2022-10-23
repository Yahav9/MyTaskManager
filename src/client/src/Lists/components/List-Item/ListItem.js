// import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../shared/components/Button/Button";

import Card from "../../../shared/components/Card/Card";
import EditForm from "../EditForm/EditForm";

function ListItem(props) {
    const [isUpdatingAList, setIsUpdatingAList] = useState(false);

    return (
        <li>
            <Card>
                {
                    isUpdatingAList &&
                    <EditForm
                        onSave={() => setIsUpdatingAList(false)}
                        value={props.name}
                    />
                }

                {
                    !isUpdatingAList &&
                    <>
                        <Link to={`/${props.user}/${props.id}`}>
                            <div>{props.name}</div>
                        </Link>
                        <div>
                            <Button>
                                <i className="material-icons"
                                // onClick={deleteHandler}
                                >
                                    delete
                                </i>
                            </Button>
                            <Button onClick={() => setIsUpdatingAList(true)}>
                                <i
                                    className="material-icons"
                                >
                                    edit
                                </i>
                            </Button>
                        </div>
                    </>
                }
            </Card>
        </li>
    )
}

export default ListItem;