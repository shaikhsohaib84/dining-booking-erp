import { Drawer as AntDrawer } from 'antd';

export const Drawer = ({
    title="",
    width='50%',
    onClose=null,
    open=false,
    extra=null,
    style,
    Children
}) => {
    return (
        <AntDrawer
            title={title}
            width={width}
            onClose={onClose}
            open={open}
            styles={style}
            extra={extra}
        >
            {Children}
        </AntDrawer>
    )
}