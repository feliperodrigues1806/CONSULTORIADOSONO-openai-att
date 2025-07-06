'use client';

import React from 'react';

// A simple component to render basic Markdown elements.
export const MarkdownContent = ({ text }: { text: string | null | undefined }) => {
  if (!text) {
    return null;
  }

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];

  const flushList = (key: string | number) => {
    if (currentList.length > 0) {
      elements.push(<ul key={`ul-${key}`} className="list-disc pl-5 space-y-1 my-2">{currentList}</ul>);
      currentList = [];
    }
  };

  const processLineContent = (line: string): React.ReactNode[] => {
    // Process bold text: **text**
    return line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('- ')) {
      // The substring logic for list items
      currentList.push(<li key={index}>{processLineContent(line.substring(line.indexOf('- ') + 2))}</li>);
    } else {
      flushList(index);
      if (line.startsWith('#### ')) {
        elements.push(<h4 key={index}>{processLineContent(line.substring(5))}</h4>);
      } else if (line.startsWith('---')) {
        elements.push(<hr key={index} className="my-4" />);
      } else if (trimmedLine !== '') {
        elements.push(<p key={index}>{processLineContent(line)}</p>);
      }
      // We don't render empty lines as <br> to avoid excessive spacing
    }
  });

  flushList('last');

  return <>{elements}</>;
};
