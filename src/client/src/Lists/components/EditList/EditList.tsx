import { useState } from 'react';

import './EditList.scss';
import Button from '../../../shared/components/Button/Button';
import Card from '../../../shared/components/Card/Card';

interface EditListProps {
    value?: string;
    onSave: (name: string) => Promise<void>;
    onCancel: () => void
}

function EditList(props: EditListProps) {
    const [value, setValue] = useState(props.value || '');

    return (
        <Card className="list-item edit-list">
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
