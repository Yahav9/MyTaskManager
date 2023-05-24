import { FormEvent, useState } from 'react';
import Button from '../../../shared/components/Button/Button';
import './Searchbar.scss';

interface SearchbarProps {
    onChange: (event: FormEvent) => void;
    onClear: () => void;
}

function Searchbar(props: SearchbarProps) {
    const [value, setValue] = useState('');

    const changeHandler = (event: FormEvent) => {
        setValue((event.target as HTMLInputElement).value);
        props.onChange(event);
    };

    const clearHandler = () => {
        setValue('');
        props.onClear();
    };

    return (
        <div className="searchbar">
            <input
                type="text"
                placeholder="Search a List..."
                value={value}
                onChange={changeHandler}
            />
            <Button
                onClick={clearHandler}
                disabled={value.length < 1}
                inverse
            >
                CLEAR
            </Button>
        </div>
    );
}

export default Searchbar;
