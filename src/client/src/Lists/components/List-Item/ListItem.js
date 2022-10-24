import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Button from "../../../shared/components/Button/Button";
import Card from "../../../shared/components/Card/Card";
import EditForm from "../EditForm/EditForm";

function ListItem(props) {
    const [isUpdatingAList, setIsUpdatingAList] = useState(false);
    const [name, setName] = useState(props.name);

    const updateList = async name => {
        const res = await axios.patch(`http://localhost:4000/api/lists/${props.id}`, { name });
        setName(res.data.list.name);
        setIsUpdatingAList(false);
    }

    return (
        <li>
            <Card>
                {
                    isUpdatingAList &&
                    <EditForm
                        onSave={updateList}
                        value={name}
                    />
                }

                {
                    !isUpdatingAList &&
                    <>
                        <Link to={`/${props.userId}/${props.id}`}>
                            <div>{name}</div>
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