import { Button as AntButton } from 'antd';

const Button = ({
    name='',
    size='small',
    type='primary',
    shape='',
    icon=null,
    disabled=false,
    danger=false,
    ghost=false,
    className='',
    onClick=()=>{}
}) => {
    return (
        <AntButton
            size={size}
            type={type}
            shape={shape}
            icon={icon}
            disabled={disabled}
            danger={danger}
            ghost={ghost}
            className={className}
            onClick={onClick}
        >
            {name}
        </AntButton>
    )
}

export default Button;