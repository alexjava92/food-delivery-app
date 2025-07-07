import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import classes from './ImageZoomModal.module.scss';

interface Props {
    src: string;
    onClose: () => void;
}

export const ImageZoomModal: React.FC<Props> = ({ src, onClose }) => {
    const [visible, setVisible] = useState(false);
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        setVisible(true);
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom((prev) => Math.min(Math.max(1, prev + delta), 3));
    };

    return (
        <div
            className={`${classes.zoomOverlay} ${visible ? classes.visible : ''}`}
            onClick={onClose}
        >
            <div
                className={classes.closeButton}
                onClick={(e) => {
                    e.stopPropagation();
                    onClose();
                }}
            >
                <X size={28} color="#fff" />
            </div>

            <div
                className={classes.scrollContainer}
                onClick={(e) => e.stopPropagation()}
                onWheel={handleWheel}
            >
                <img
                    src={src}
                    alt="product"
                    className={classes.zoomImage}
                    style={{ transform: `scale(${zoom})` }}
                />
            </div>
        </div>
    );
};
