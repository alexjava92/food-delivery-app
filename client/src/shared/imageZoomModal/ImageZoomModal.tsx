// components/ImageZoomModal.tsx
import React from "react";
import { useGesture } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";
import "./ImageZoomModal.css";

interface Props {
    src: string;
    onClose: () => void;
}

export const ImageZoomModal: React.FC<Props> = ({ src, onClose }) => {
    const [{ scale, x, y }, api] = useSpring(() => ({ scale: 1, x: 0, y: 0 }));

    const bind = useGesture(
        {
            onPinch: ({ offset: [s] }) => api.start({ scale: s }),
            onDrag: ({ offset: [dx, dy] }) => api.start({ x: dx, y: dy }),
            onWheel: ({ offset: [, s] }) => api.start({ scale: 1 + s / 100 }),
        },
        {
            pinch: { scaleBounds: { min: 1, max: 3 }, rubberband: true },
            drag: { rubberband: true },
        }
    );

    return (
        <div className="zoom-overlay" onClick={onClose}>
            <animated.img
                {...bind()}
                src={src}
                className="zoom-image"
                style={{ scale, x, y }}
                onClick={(e) => e.stopPropagation()}
            />
        </div>
    );
};