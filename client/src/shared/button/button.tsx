import React, { FC, memo } from "react";
import classes from './button.module.scss';
import {useTelegram} from "../../hooks/useTelegram";

interface IType {
    children: React.ReactNode;
    onClick?: () => void;
    active?: boolean;
    size?: "small" | "medium" | "large";
    disabled?: boolean;
    color?: "primary" | "success" | "danger" | "gray";
    haptic?: "light" | "medium" | "heavy" | "soft" | "rigid";
    className?: string;
}



export const Button: FC<IType> = memo(
    ({ children, onClick, active, size = "medium", disabled = false, color = "primary", haptic, className  }) => {
        const classNames = [
            classes.button,
            classes[color],
            active ? classes.active : "",
            disabled ? classes.disabled : "",
            size && classes[size],
            className,
        ]
            .filter(Boolean)
            .join(" ");

        const { tg } = useTelegram();

        const handleClick = () => {
            if (!disabled && onClick) {
                if (haptic) {
                    tg?.HapticFeedback?.impactOccurred(haptic);
                }
                onClick();
            }
        };

        return (
            <button className={classNames} onClick={handleClick}>
                {children}
            </button>
        );
    }
);
