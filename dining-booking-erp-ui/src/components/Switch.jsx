import { Switch as AntSwitch } from 'antd'

export const Switch = ({
    defaultCheck=true,
    onChange=null,
    style,
    ...children
}) => {
    return (
        <AntSwitch 
            defaultChecked={defaultCheck}
            onChange={onChange}
            style={style}
            {...children}
        />
    )
}