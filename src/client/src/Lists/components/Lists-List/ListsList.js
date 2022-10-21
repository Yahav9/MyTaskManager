import React from "react";
import ListItem from "../List-Item/ListItem";

function ListsLists(props) {
    let lists = props.lists;
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
            <button>CREATE NEW LIST</button>
        </ul>
    )
}

export default ListsLists;