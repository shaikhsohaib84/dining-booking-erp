import { Menu  as AntMenu } from 'antd';

export const MenuTab = ({
    items,
    current,
    onClick,
}) => {
    return (
        <AntMenu
            onClick={onClick}
            selectedKeys={[current]}
            mode="horizontal"
            items={items}
        />
    )
}