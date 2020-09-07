import React from 'react';

export function ErrorText(props: { text: string }) {
  return (
    <span style={{ color: 'red', fontSize: 11, lineHeight: '2px' }}>
      {props.text}
    </span>
  );
}
