import React, {FC} from 'react';
interface IType {
    isActive?: boolean
}



export const MoreIcon: FC<IType> = ({isActive}) => {
    return (
        <svg width="24" height="7" viewBox="0 0 24 7" xmlns="http://www.w3.org/2000/svg">
        <circle cx="3.3038" cy="3.3038" r="3.3038"/>
        <circle cx="11.9999" cy="3.3038" r="3.3038"/>
        <circle cx="20.6963" cy="3.3038" r="3.3038"/>
        </svg>
        
);
};

