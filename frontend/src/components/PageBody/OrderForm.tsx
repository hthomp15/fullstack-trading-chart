// OrderForm.tsx
import React, { useState } from 'react';

const OrderForm: React.FC = () => {
    const [orderType, setOrderType] = useState<"long" | "short">("long");
    const [size, setSize] = useState<number | "">("");

    const handleOrderSelection = () => {
        if(orderType === "long") setOrderType("short")
        else setOrderType("long")
    }

    return (
        <div className="order-form flex flex-col px-4 mx-4 bg-[#171513] w-3/12">
            <div className="tabs flex flex-row">
                <button onClick={handleOrderSelection} className={`text-2xl  w-full p-3 bg-[#171513] mx-2 ${orderType === "long" ? "text-[#c94b38] border-b-2 border-[#703026]" : "text-[#9d9a9b]"}`}>Long</button>
                <button onClick={handleOrderSelection} className={`text-2xl  w-full p-3 bg-[#171513] mx-2 ${orderType === "long" ? "text-[#c94b38] border-b-2 border-[#703026]" : "text-[#9d9a9b]"}`}>Short</button>
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
