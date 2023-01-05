import React, { useState } from 'react';

import './EditList.scss';
import Button from '../../../shared/components/Button/Button';
import Card from '../../../shared/components/Card/Card';

function EditList(props) {
    const [value, setValue] = useState(props.value || '');

    return (
        <Card className="list-item edit">
            <input
                type="text"
                value={value}
                autoFocus
                onChange={event => setValue(event.target.value)}
            />
            <div className="buttons">
                <Button
                    className="edit-button"
                    onClick={() => props.onSave(value)}
                    disabled={value.length < 1}
                >
                    SAVE
                </Button>
                <Button
                    className="edit-button"
                    inverse
                    onClick={props.onCancel}
                >
                    CANCEL
                </Button>
            </div>
        </Card>
    );
}

export default EditList;
