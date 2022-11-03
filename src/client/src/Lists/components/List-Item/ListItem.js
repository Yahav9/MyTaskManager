import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Button from "../../../shared/components/Button/Button";
import Card from "../../../shared/components/Card/Card";
import EditList from "../EditList/EditList";
import { AuthContext } from "../../../shared/context/AuthContext";
import LoadingSpinner from "../../../shared/components/LoadingSpinner/LoadingSpinner";

function ListItem(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdatingAList, setIsUpdatingAList] = useState(false);
    const [name, setName] = useState(props.name);
    const auth = useContext(AuthContext);

    const updateList = async name => {
        let res;
        try {
            setIsLoading(true);
            res = await axios.patch(`http://localhost:4000/api/lists/${props.id}`, { name }, {
                headers: { authorization: auth.token }
            });
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
        setName(res.data.list.name);
        setIsUpdatingAList(false);
    }

    const deleteHandler = async () => {
        try {
            setIsLoading(true);
            await axios.delete(`http://localhost:4000/api/lists/${props.id}`, {
                headers: { authorization: auth.token }
            });
            setIsLoading(false);
            props.onDelete(props.id);
        } catch (e) {
            setIsLoading(false);
            console.log(e)
        }
    }

    return (
        <li>
            <Card>
                {
                    isUpdatingAList &&
                    <EditList
                        onSave={updateList}
                        value={name}
                    />
                }
                {isLoading && <LoadingSpinner asOverlay />}
                {
                    !isUpdatingAList && !isLoading &&
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