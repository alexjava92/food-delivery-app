import React, { FC } from 'react';

interface IType {
    isSimple?: boolean;
}

export const ContactsIcon: FC<IType> = ({ isSimple }) => {
    return (
        <div>
            {isSimple && (
                <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
            )}
        </div>
    );
};
