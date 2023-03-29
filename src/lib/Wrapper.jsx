import React from "react";
import { useEffect, useRef } from "react"

export default function Wrapper({ children, onOutsideClick, disabled, display, wrapperStyle }) {
    const wrapperRef = useRef()

    useEffect(() => {
        const triggered = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                if (e.target.className !== 'ignore') {
                    onOutsideClick(e)
                }
            }
        }
        if (!disabled) {
            document.addEventListener("mousedown", triggered);
        }
        return () => {
            document.removeEventListener("mousedown", triggered);
        };
    });

    return (
        <div
        ref={wrapperRef}
        className='wrapper'
        style={{display: display, ...wrapperStyle}}
        >
            {children}
        </div>
    )
}