
import React,{FC,memo}  from "react";
import classes from './plusAndMinus.module.scss'
import {addProductToCart, decrement} from "../../store/slice/productsSlice";
import {MinusIcon} from "../images/icons/minusIcon";
import {PlusIcon} from "../images/icons/plusIcon";
import {IProduct} from "../../types/types";
import {useAppDispatch} from "../../hooks/useRedux";


interface IType{
  data: IProduct
    isBlack?:boolean
}

export const PlusAndMinus: FC<IType> = memo(({data,isBlack}) => {
    const dispatch = useAppDispatch();
    return (
        <div className={isBlack ? `${classes.buttonGroup} ${classes.buttonGroupBlack}` :classes.buttonGroup}>
            <button className={classes.button} onClick={() => dispatch(decrement(data))}>
                <MinusIcon/>
            </button>
            <span>{data.count}</span>
            <button className={classes.button} onClick={() => dispatch(addProductToCart(data))}>
                <PlusIcon/>
            </button>
        </div>
    )
}) 
