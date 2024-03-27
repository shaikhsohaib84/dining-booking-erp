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
            columns={columns} 
            dataSource={data} 
            style={style}
            className={className}
            {...children}
        />
    )
}