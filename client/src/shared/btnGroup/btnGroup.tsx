
import React,{FC,memo}  from "react";
import classes from './btnGroup.module.scss'


interface IType{
    onClickOneBtn: ()=>void
    activeOneBtn: boolean
    textOneBtn: string
    onClickTwoBtn: ()=>void
    activeTwoBtn: boolean
    textTwoBtn: string
}

export const BtnGroup: FC<IType> = memo(({onClickOneBtn,textOneBtn,onClickTwoBtn,textTwoBtn,activeOneBtn,activeTwoBtn}) => {
    return (
        <div className={classes.btnGroup}>
            <button className={activeOneBtn ? classes.active :''} onClick={onClickOneBtn}>{textOneBtn}</button>
            <button className={activeTwoBtn ? classes.active :''} onClick={onClickTwoBtn}>{textTwoBtn}</button>
        </div>
    )
}) 
