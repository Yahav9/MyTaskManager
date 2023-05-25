import { FormEvent, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import './ListsPage.scss';
import Searchbar from './components/Searchbar/Searchbar';
import ListsList from './components/Lists-List/ListsList';
import { AuthContext } from '../shared/context/AuthContext';
import LoadingSpinner from '../shared/components/LoadingSpinner/LoadingSpinner';

export interface List {
    _id: string;
    name: string;
}

function ListsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [listsData, setListsData] = useState<List[]>([]);
    const [filteredListsData, setFilteredListsData] = useState<List[]>([]);
    const auth = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            let res;
            try {
                setIsLoading(true);
                res = await axios.get(`https://my-task-manager-rh8y.onrender.com/api/lists/${auth.userId}`, {
                    headers: { authorization: auth.token as string }
                });
                setIsLoading(false);
            } catch (e) {
                setIsLoading(false);
                console.log(e);
            }
            setListsData(res?.data);
            setFilteredListsData(res?.data);
        })();
    }, [auth.userId, auth.token]);

    const onSearchbarChange = (event: FormEvent) => {
        setFilteredListsData(
            listsData.filter(list => list.name.includes((event.target as HTMLInputElement).value))
        );
    };

    const addNewList = (newList: List) => {
        setListsData(lists => [...lists, newList]);
        setFilteredListsData(lists => [...lists, newList]);
    };

    const deleteList = (deletedListId: string) => {
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
                    userId={auth.userId as string}
                    onListCreation={addNewList}
                    onListDelete={deleteList}
                />
            }
        </div>
    );
}

export default ListsPage;
