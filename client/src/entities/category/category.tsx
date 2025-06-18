import React, {FC, memo} from "react";
import classes from "./category.module.scss";
import {ICategory} from "../../types/types";
import {LinkAll} from "../../shared/linkAll/linkAll";

interface IType {
    data: ICategory;
    inkAll?: boolean;
}

export const Category: FC<IType> = memo(({data, inkAll}) => {
    return (
        <div className={classes.category}>
            <h2 className={classes.title}>
                <span>{data.title}</span>
                {inkAll && <LinkAll link={`category/${data.id}`}/>}
            </h2>
            <div className={classes.image}>
                <img src={process.env.REACT_APP_API_URL + data.image} alt={data.title}/>
            </div>
        </div>
    );
});
