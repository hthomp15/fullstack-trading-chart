// OrderForm.tsx
import React, { useState } from 'react';

const OrderForm: React.FC = () => {
    const [orderType, setOrderType] = useState<"long" | "short">("long");
    const [size, setSize] = useState<number | "">("");

    return (
        <div className="order-form">
            <div className="tabs">
                <button onClick={() => setOrderType("long")} style={{ color: orderType === "long" ? "green" : "black" }}>Long</button>
                <button onClick={() => setOrderType("short")} style={{ color: orderType === "short" ? "red" : "black" }}>Short</button>
            </div>
            <form>
                <label>Order Type</label>
                <select>
                    <option value="market">Market</option>
                    <option value="limit">Limit</option>
                </select>
                <label>Size</label>
                <input type="number" value={size} onChange={(e) => setSize(parseFloat(e.target.value) || "")} />
                <label>Leverage</label>
                <input type="range" min="1" max="100" />
                {/* Additional form inputs */}
                <button type="submit">Buy / {orderType.charAt(0).toUpperCase() + orderType.slice(1)}</button>
            </form>
        </div>
    );
};

export default OrderForm;
