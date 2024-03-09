import { Alert as AntAlert } from "antd";

export const Alert = ({
    message="",
    description="",
    type="",
    showIcon=false,
    closable=false
}) => {
    return (
        <AntAlert
            message={message}
            description={description}
            showIcon={showIcon}
            type={type}
            closable={closable}
        />
    )
}