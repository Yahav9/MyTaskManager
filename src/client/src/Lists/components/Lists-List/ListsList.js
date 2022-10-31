import React, { useContext, useState } from "react";
import axios from "axios";

import ListItem from "../List-Item/ListItem";
import Card from "../../../shared/components/Card/Card";
import Button from "../../../shared/components/Button/Button";
import EditForm from "../EditForm/EditForm";
import { AuthContext } from "../../../shared/context/AuthContext";

function ListsList(props) {
    const [isCreatingAList, setIsCreatingAList] = useState(false);
    const auth = useContext(AuthContext);

    const createList = async name => {
        const res = await axios.post(`http://localhost:4000/api/lists/${props.userId}`, { name }, {
            headers: { authorization: auth.token }
        });
        props.onListCreation(res.data.newList);
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
                {isCreatingAList && <EditForm onSave={createList} />}
                {
                    !isCreatingAList &&
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