import { Tag, Typography } from "antd";
import { CATEGORIES } from "../constants";
import { AgroFundConsumer } from "../Context/AgrofundContract";

export default function Categories({
}) {
    return (
        <AgroFundConsumer>
            { ({selectedCategories, selectCategory }) => (
            <div style={{ padding: '0 0px' }}>
                <Typography.Title level={4}>Categories</Typography.Title>
                {
                    CATEGORIES?.map(cat => (
                        <Tag.CheckableTag
                            style={{ border: "1px solid #ddd", margin: '7px', borderRadius: "5px 5px", padding: '10px' }}
                            key={cat}
                            onChange={() => selectCategory(cat)}
                            checked={selectedCategories.get(cat)}
                        >
                            <span>
                                {cat}
                            </span>
                        </Tag.CheckableTag>)
                    )
                }

            </div>
            )}
        </AgroFundConsumer>
    );
}