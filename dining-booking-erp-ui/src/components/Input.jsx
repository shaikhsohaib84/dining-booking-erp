import { Input as AntInput } from 'antd';

export const Input = ({
    placeholder='',
    size="large",
    className='',
    ...children
}) => {
    return (
        <AntInput 
            className={className}
            placeholder={placeholder}
            size={size}
            {...children}
        />
    )
}