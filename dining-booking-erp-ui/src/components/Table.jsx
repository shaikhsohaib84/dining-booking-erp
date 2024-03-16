import { Table as AntTable } from 'antd';

export const Table = ({
    columns,
    data,
    className,
    style,
}) => {
    return (
        <AntTable
            className={className}
            columns={columns} 
            dataSource={data} 
            style={style}
        />
    )
}