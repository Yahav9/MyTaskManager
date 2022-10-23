import React, { useState } from "react";

import ListItem from "../List-Item/ListItem";
import Card from "../../../shared/components/Card/Card";
import Button from "../../../shared/components/Button/Button";
import EditForm from "../EditForm/EditForm"

function ListsList(props) {
    const [isCreatingAList, setIsCreatingAList] = useState(false);

    const lists = props.lists;
    if (lists.length < 1) {
        return (
            <div>
                <Card>
                    <h2>No lists found...</h2>
                </Card>
                <Card>
                    <button>CREATE NEW LIST</button>
                </Card>
            </div>
        )
    }

    return (
        <ul>
            {lists.map(list => {
                return <ListItem
                    key={list._id}
                    id={list._id}
                    name={list.name}
                    user={list.user}
                // onDelete={props.onListDelete}
                />
            })}
            <Card>
                {isCreatingAList && <EditForm onSave={() => setIsCreatingAList(false)} />}
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