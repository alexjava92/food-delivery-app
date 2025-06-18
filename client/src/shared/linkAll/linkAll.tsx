
import React,{FC,memo}  from "react";
import classes from './linkAll.module.scss'
import {ArrowIcon} from "../images/icons/arrowIcon";


interface IType{
    link: string
    text?: string
}

export const LinkAll: FC<IType> = memo(({text,link}) => {
    return (
        <div className={classes.link}>
            <span>{text ? text : 'все'}</span>
            <span>
                &nbsp;
                <ArrowIcon/>
            </span>
        </div>
    )
}) 
