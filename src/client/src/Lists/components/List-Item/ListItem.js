import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import './ListItem.scss'
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
            {
                isUpdatingAList && !isLoading &&
                <EditList
                    onSave={updateList}
                    onCancel={() => setIsUpdatingAList(false)}
                    value={name}
                />
            }
            {isLoading && <Card className="list-item"><LoadingSpinner asOverlay /></Card>}
            {
                !isUpdatingAList && !isLoading &&
                <Card className={`list-item ${!isLoading && !isUpdatingAList && 'hover-animation'}`}>
                    <Link to={`/${props.userId}/${props.id}`}>
                        <h2>{name}</h2>
                    </Link>
                    <div className="buttons">
                        <Button onClick={() => setIsUpdatingAList(true)} inverse>
                            <i
                                className="material-icons"
                            >
                                edit
                            </i>
                        </Button>
                        <Button onClick={deleteHandler} danger>
                            <i className="material-icons"
                            >
                                delete
                            </i>
                        </Button>
                    </div>
                </Card>
            }
        </li>
    )
}

export default ListItem;