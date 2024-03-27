import { Table as AntTable } from 'antd';

export const Table = ({
    columns=[],
    data=[],
    className,
    style,
    ...children
}) => {
    return (
        <AntTable
            className={className}
            columns={columns} 
            dataSource={data} 
            style={style}
            {...children}
        />
    )
}