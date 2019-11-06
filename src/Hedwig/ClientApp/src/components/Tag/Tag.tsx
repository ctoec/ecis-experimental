import React from 'react';

export type TagProps = {
    text: String;
    color?: string;
};

export default function Tag({ text, color}: TagProps) {
    var className = "usa-tag";
    if (color) className += ` bg-${color}`;
    return (
        <span className={className}>{text}</span>
    );
}