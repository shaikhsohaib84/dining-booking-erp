import React from 'react';
import { Card as AntCard } from 'antd';

export const Card = ({
    title=null,
    className,
    onClick,
    ChildComponent,
    ...children
}) => (
  <AntCard 
    className={`${className} width-300`}
    title={title}
    onClick={onClick}
    {...children}
    >
      {ChildComponent}
  </AntCard>
);