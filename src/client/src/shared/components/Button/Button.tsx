import { MouseEventHandler, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import './Button.scss';

interface ButtonProps {
    href?: string;
    size?: 'small' | 'big';
    danger?: boolean;
    to?: string;
    inverse?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
    onClick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    children?: ReactNode;
}

const Button = (props: ButtonProps) => {
    if (props.href) {
        return (
            <a
                className={`button button--${props.size || 'default'} ${props.inverse &&
                    'button--inverse'} ${props.danger && 'button--danger'}`}
                href={props.href}
            >
                {props.children}
            </a>
        );
    }
    if (props.to) {
        return (
            <Link
                to={props.to}
                className={`button button--${props.size || 'default'} ${props.inverse &&
                    'button--inverse'} ${props.danger && 'button--danger'}`}
            >
                {props.children}
            </Link>
        );
    }
    return (
        <button
            className={`button ${props.className} button--${props.size || 'default'} ${props.inverse &&
                'button--inverse'} ${props.danger && 'button--danger'}`}
            type={props.type}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
};

export default Button;
