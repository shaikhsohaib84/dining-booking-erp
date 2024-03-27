import { Modal as AntModal } from "antd";

export const ConfirmModal = ({
    title = "",
    open = false,
    okText = "",
    okType = "primary",
    cancelText = "",
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