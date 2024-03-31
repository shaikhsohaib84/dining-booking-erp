import { Modal as AntModal } from "antd";

export const ConfirmModal = ({
    title = "",
    open = false,
    okText = null,
    okType = "primary",
    cancelText = null,
    icon = null,
    onOk = null,
    onCancel = null,
    Children,
    ...rest
}) => {
    return (
        <AntModal
            title={title}
            open={open}
            icon={icon}
            okText={okText}
            okType={okType}
            onCancel={onCancel}
            onOk={onOk}
            cancelText={cancelText}
            {...rest}
        >
            {Children}
        </AntModal>
    )
}