import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import './ListsPage.scss';
import Searchbar from './components/Searchbar/Searchbar';
import ListsList from './components/Lists-List/ListsList';
import { AuthContext } from '../shared/context/AuthContext';
import LoadingSpinner from '../shared/components/LoadingSpinner/LoadingSpinner';

function ListsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [listsData, setListsData] = useState([]);
    const [filteredListsData, setFilteredListsData] = useState([]);
    const auth = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            let res;
            try {
                setIsLoading(true);
                res = await axios.get(`https://my-awesome-task-manager.herokuapp.com/api/lists/${auth.userId}`, {
                    headers: { authorization: auth.token }
                });
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
            setListsData(res.data);
            setFilteredListsData(res.data);
        })();
    }, [auth.userId, auth.token]);

    const onSearchbarChange = event => {
        setFilteredListsData(listsData.filter(list => list.name.includes(event.target.value)));
    };

    const addNewList = newList => {
        setListsData(lists => [...lists, newList]);
        setFilteredListsData(lists => [...lists, newList]);
    };

    const deleteList = deletedListId => {
        setListsData(listsData.filter(list => list._id !== deletedListId));
        setFilteredListsData(listsData.filter(list => list._id !== deletedListId));
    };

    return (
        <div className="lists-page">
            <h1>My Lists</h1>
            <Searchbar
                onChange={onSearchbarChange}
                onClear={() => setFilteredListsData(listsData)}
            />
            {isLoading && <LoadingSpinner asOverlay />}
            {
                !isLoading &&
                <ListsList
                    lists={filteredListsData}
                    userId={auth.userId}
                    onListCreation={addNewList}
                    onListDelete={deleteList}
                />
            }
        </div>
    );
}

export default ListsPage;
