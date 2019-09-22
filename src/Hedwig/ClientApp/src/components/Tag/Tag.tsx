import React from 'react';

export type TagProps = {
    text: String;
};

export default function Tag({ text }: TagProps) {
    return (
        <span className="usa-tag">{text}</span>
    );
}