import React, { useContext, useState } from "react";
import axios from "axios";

import ListItem from "../List-Item/ListItem";
import Card from "../../../shared/components/Card/Card";
import Button from "../../../shared/components/Button/Button";
import EditList from "../EditList/EditList";
import { AuthContext } from "../../../shared/context/AuthContext";
import LoadingSpinner from "../../../shared/components/LoadingSpinner/LoadingSpinner";

function ListsList(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingAList, setIsCreatingAList] = useState(false);
    const auth = useContext(AuthContext);

    const createList = async name => {
        let res;
        try {
            setIsLoading(true);
            res = await axios.post(`http://localhost:4000/api/lists/${props.userId}`, { name }, {
                headers: { authorization: auth.token }
            });
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
        props.onListCreation(res.data);
        setIsCreatingAList(false);
    }

    const lists = props.lists;
    return (
        <ul>
            {
                lists.length < 1 &&
                <Card>
                    <h2>No lists found...</h2>
                </Card>
            }
            {
                lists.length > 0 && lists.map(list => {
                    return <ListItem
                        key={list._id}
                        id={list._id}
                        name={list.name}
                        userId={list.user}
                        onDelete={props.onListDelete}
                    />
                })
            }
            <Card>
                {isCreatingAList && <EditList onSave={createList} />}
                {isLoading && <LoadingSpinner asOverlay />}
                {
                    !isCreatingAList && !isLoading &&
                    <Button
                        onClick={() => setIsCreatingAList(true)}
                    >
                        CREATE NEW LIST
                    </Button>
                }
            </Card>
        </ul>
    )
}

export default ListsList;