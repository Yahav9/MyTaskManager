import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Button from "../../../shared/components/Button/Button";
import Card from "../../../shared/components/Card/Card";
import EditForm from "../EditForm/EditForm";
import { AuthContext } from "../../../shared/context/AuthContext";

function ListItem(props) {
    const [isUpdatingAList, setIsUpdatingAList] = useState(false);
    const [name, setName] = useState(props.name);
    const auth = useContext(AuthContext);

    const updateList = async name => {
        const res = await axios.patch(`http://localhost:4000/api/lists/${props.id}`, { name }, {
            headers: { authorization: auth.token }
        });
        setName(res.data.list.name);
        setIsUpdatingAList(false);
    }

    const deleteHandler = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/lists/${props.id}`, {
                headers: { authorization: auth.token }
            });
            props.onDelete(props.id);
        } catch (e) {
            console.log(e)
        }
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
                            <Button onClick={deleteHandler}>
                                <i className="material-icons"
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