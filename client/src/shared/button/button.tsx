import React, { FC, memo } from "react";
import classes from './button.module.scss';

interface IType {
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    size?: "small" | "medium" | "large"; // опциональные размеры
    disabled?: boolean; // опциональный дизейбл
}

export const Button: FC<IType> = memo(({ children, onClick, active, size = "medium", disabled = false }) => {
    const classNames = [
        classes.button,
        active ? classes.active : "",
        disabled ? classes.disabled : "",
        size && classes[size]
    ].join(" ").trim();

    const handleClick = () => {
        if (!disabled && onClick) {
            onClick();
        }
    };

    return (
        <div className={classNames} onClick={handleClick}>
            {children}
        </div>
    );
});
