import React from 'react';
import { Card as AntCard } from 'antd';

export const Card = ({
    title=null,
    ChildComponent,
    className,
    ...children
}) => (
  <AntCard 
    className={`${className} width-300`}
    title={title}
    {...children}
    >
      {ChildComponent}
  </AntCard>
);