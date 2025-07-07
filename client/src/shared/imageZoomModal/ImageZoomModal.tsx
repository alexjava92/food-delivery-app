import React, { useEffect, useState } from "react";
import classes from './ImageZoomModal.module.scss';
import { X } from "lucide-react"; // если ты используешь lucide (иначе — любая иконка)

interface Props {
    src: string;
    onClose: () => void;
}

export const ImageZoomModal: React.FC<Props> = ({ src, onClose }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setVisible(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div
            className={`${classes.zoomOverlay} ${visible ? classes.visible : ''}`}
            onClick={onClose}
        >
            <div className={classes.closeButton} onClick={(e) => {
                e.stopPropagation();
                onClose();
            }}>
                <X size={28} color="#fff" />
            </div>

            <img
                src={src}
                alt="product"
                className={classes.zoomImage}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
};
