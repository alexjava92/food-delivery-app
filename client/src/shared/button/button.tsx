import React, { FC, memo } from "react";
import classes from './button.module.scss';

interface IType {
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    color?: "primary" | "success" | "danger" | "gray"; 
}

export const Button: FC<IType> = memo(
    ({ children, onClick, active, size = "medium", disabled = false, color = "primary" }) => {
        const classNames = [
            classes.button,
            classes[color],
            active ? classes.active : "",
            disabled ? classes.disabled : "",
            size && classes[size],
        ]
            .filter(Boolean)
            .join(" ");

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
    }
);
