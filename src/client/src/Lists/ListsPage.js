import React, { useContext, useEffect, useState } from "react";
import axios from "axios"

import Searchbar from "./components/Searchbar/Searchbar";
import ListsList from "./components/Lists-List/ListsList";
import { AuthContext } from "../shared/context/AuthContext";

function ListsPage() {
    const [listsData, setListsData] = useState([]);
    const [filteredListsData, setFilteredListsData] = useState([]);
    const auth = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            const res = await axios.get(`http://localhost:4000/api/lists/${auth.userId}`, {
                headers: { authorization: auth.token }
            });
            setListsData(res.data);
            setFilteredListsData(res.data);
        })();
    }, [auth.userId, auth.token])

    const onSearchbarChange = event => {
        setFilteredListsData(listsData.filter(list => list.name.includes(event.target.value)));
    }

    const addNewList = newList => {
        setListsData(lists => [...lists, newList]);
        setFilteredListsData(lists => [...lists, newList]);
    }

    const deleteList = deletedListId => {
        setListsData(listsData.filter(list => list._id !== deletedListId));
        setFilteredListsData(listsData.filter(list => list._id !== deletedListId));
    }

    return (
        <div>
            <h1>My Lists</h1>
            <Searchbar
                onChange={onSearchbarChange}
                onClear={() => setFilteredListsData(listsData)}
            />
            <ListsList
                lists={filteredListsData}
                userId={auth.userId}
                onListCreation={addNewList}
                onListDelete={deleteList}
            />
        </div>
    )
}

export default ListsPage;