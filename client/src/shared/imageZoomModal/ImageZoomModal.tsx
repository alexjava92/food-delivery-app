import React, { useEffect, useState } from "react";
import classes from './ImageZoomModal.module.scss';
import { X } from "lucide-react";

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
            onClick={onClose} // ✅ клик по фону
        >
            <div
                className={classes.closeButton}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose(); // ✅ крестик
                }}
            >
                <X size={28} color="#fff" />
            </div>

            <img
                src={src}
                alt="product"
                className={classes.zoomImage}
                onClick={onClose} // ✅ клик по картинке
            />
        </div>
    );
};
