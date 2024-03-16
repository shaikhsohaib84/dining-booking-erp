import { Input as AntInput } from 'antd';
const { Search: AntSearch} = AntInput;

export const Search = ({
    placeholder="",
    onSearch,
    style,
    className
}) => {
    return (
        <AntSearch
            allowClear
            className={className}
            placeholder={placeholder}
            onSearch={onSearch}
            style={style}
        />
    )
}