import React, { useEffect, useState } from "react";
import axios from "axios"

import Searchbar from "./components/Searchbar/Searchbar";
import ListsList from "./components/Lists-List/ListsList";
import { useParams } from "react-router-dom";

function ListsPage() {
    const [listsData, setListsData] = useState([]);
    const [filteredListsData, setFilteredListsData] = useState([]);

    const userId = useParams().userId;

    useEffect(() => {
        (async () => {
            const res = await axios.get(`http://localhost:4000/api/lists/${userId}`);
            setListsData(res.data);
            setFilteredListsData(res.data);
        })();
    }, [userId])

    const onSearchbarChange = event => {
        setFilteredListsData(listsData.filter(list => list.name.includes(event.target.value)));
    }

    const onSearchbarClear = () => {
        setFilteredListsData(listsData);
    }

    const addNewList = newList => {
        setListsData(listsData.push(newList));
        setFilteredListsData(listsData.push(newList));
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
                onClear={onSearchbarClear}
            />
            <ListsList
                lists={filteredListsData}
                userId={userId}
                onListCreation={addNewList}
                onListDelete={deleteList}
            />
        </div>
    )
}

export default ListsPage;