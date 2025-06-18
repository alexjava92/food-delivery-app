import React, {FC, memo} from "react";
import classes from './button.module.scss'


interface IType {
    children: React.ReactNode
    onClick?: () => void
    active?: boolean
}

export const Button: FC<IType> = memo(({children, onClick,active}) => {
    return (
        <div className={active ? `${classes.button} ${classes.active}` : classes.button} onClick={onClick}>
            {children}
        </div>
    )
}) 
