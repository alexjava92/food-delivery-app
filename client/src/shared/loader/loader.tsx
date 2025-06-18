import React, {FC, memo} from "react";
import classes from './loader.module.scss'
import ContentLoader from "react-content-loader";


interface IType {
    height?: number
    circle?: boolean
}

export const Loader: FC<IType> = memo(({height, circle}) => {
    return (
        <>
        {
            circle ?
                <div className={'loader'}>
                    <ContentLoader viewBox="0 0 400 160" height={'100%'} width={'100%'} foregroundColor="#8E8E8E"
                                   backgroundColor="#fff">
                    <circle cx="150" cy="86" r="8"/>
                    <circle cx="194" cy="86" r="8"/>
                    <circle cx="238" cy="86" r="8"/>
                </ContentLoader>
            </div>
            :
            <ContentLoader className={classes.loader} height={height} width={`100%`}>
        <rect x="0" y="0" rx="2" ry="2" width={`100%`} height={`100%`}/>
        </ContentLoader>
}
</>

)
}) 
