"use client";

import { useState, useEffect, useRef } from "react";

const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

export default function TextDecrypt({ text, className = "" }: { text: string, className?: string }) {
    const [displayText, setDisplayText] = useState(text);
    const [isHovering, setIsHovering] = useState(false);
    const intervalRef = useRef<any>(null);

    const scramble = () => {
        let iteration = 0;
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText(prev =>
                text.split("").map((letter, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                }).join("")
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current);
            }
            iteration += 1 / 3;
        }, 30);
    };

    return (
        <span
            className={`inline-block cursor-default ${className}`}
            onMouseEnter={() => scramble()}
        >
            {displayText}
        </span>
    );
}
