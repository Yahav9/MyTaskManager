import React, { useContext, useState } from 'react';
import axios from 'axios';

import './ListsList.scss';
import ListItem from '../List-Item/ListItem';
import Card from '../../../shared/components/Card/Card';
import Button from '../../../shared/components/Button/Button';
import EditList from '../EditList/EditList';
import { AuthContext } from '../../../shared/context/AuthContext';
import LoadingSpinner from '../../../shared/components/LoadingSpinner/LoadingSpinner';

function ListsList(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isCreatingAList, setIsCreatingAList] = useState(false);
    const auth = useContext(AuthContext);

    const createList = async name => {
        let res;
        try {
            setIsCreatingAList(false);
            setIsLoading(true);
            res = await axios.post(
                `https://my-task-manager-rh8y.onrender.com/api/lists/${props.userId}`,
                { name },
                { headers: { authorization: auth.token } }
            );
            setIsLoading(false);
        } catch (e) {
            setIsLoading(false);
            console.log(e);
        }
        props.onListCreation(res.data);
    };

    const lists = props.lists;
    return (
        <ul className="lists-list">
            {
                lists.length < 1 &&
                <li>
                    <Card className="list-item">
                        <h2 className="no-lists">No lists found...</h2>
                    </Card>
                </li>
            }
            {
                lists.length > 0 && lists.map(list => {
                    return <ListItem
                        key={list._id}
                        id={list._id}
                        name={list.name}
                        userId={list.user}
                        onDelete={props.onListDelete}
                        abortListCreation={() => setIsCreatingAList(false)}
                        isCreatingAList={isCreatingAList}
                    />;
                })
            }
            {isCreatingAList && <li><EditList onSave={createList} onCancel={() => setIsCreatingAList(false)} /></li>}
            {isLoading && <li><Card className="list-item"><LoadingSpinner asOverlay /></Card></li>}
            {
                !isCreatingAList && !isLoading &&
                <Button
                    className="create-button"
                    onClick={() => setIsCreatingAList(true)}
                >
                    CREATE NEW LIST
                </Button>
            }

        </ul>
    );
}

export default ListsList;
