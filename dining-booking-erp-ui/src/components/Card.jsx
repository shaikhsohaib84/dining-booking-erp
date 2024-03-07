import React, { Children } from 'react';
import { Card as AntCard } from 'antd';

const Card = ({
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

export default Card;