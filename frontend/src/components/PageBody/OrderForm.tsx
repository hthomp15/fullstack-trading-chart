import React, { useState, useRef, useEffect } from 'react';
import Confetti from 'react-confetti';

const OrderForm: React.FC = () => {
    const [orderType, setOrderType] = useState<"long" | "short">("long");
    const [size, setSize] = useState<number | "">("");
    const [leverage, setLeverage] = useState<number>(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const leverageMarks = [2, 5, 10, 25, 50, 100, 128];
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleLeverageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLeverage(Number(event.target.value));
    };

    const formatLeverage = (value: number) => {
        if (value === 0) return '0,00X';
        return `${new Intl.NumberFormat().format(value)}X`;
    };

    const handleOrderSelection = () => {
        if (orderType === "long") setOrderType("short");
        else setOrderType("long");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfetti(true);
        setTimeout(() => {
            setShowConfetti(false)
        }, 2000)
    };

    // To get the position of the button
    const [buttonPosition, setButtonPosition] = useState({ x: 0, y: 0, w: 0, h: 0 });
    useEffect(() => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setButtonPosition({
                x: rect.left + window.pageXOffset,  // Adjusting for page scroll offset
                y: rect.top + window.pageYOffset,   // Adjusting for page scroll offset
                w: rect.width,
                h: rect.height
            });
        }
    }, [showConfetti]);

    return (
        <div className="order-form flex flex-col px-3 bg-[#171513] w-3/12 text-[#adadad] text-left relative">
            <div className="tabs flex flex-row mb-4 ">
                <button
                    onClick={handleOrderSelection}
                    className={`text-xl  w-full p-3 bg-[#171513] mx-2 ${orderType === "long" ? "text-[#fe5144] border-b-2 border-[#fe5144]" : "text-[#9d9a9b]"}`}
                >
                    Long
                </button>
                <button
                    onClick={handleOrderSelection}
                    className={`text-xl  w-full p-3 bg-[#171513] mx-2 ${orderType === "short" ? "text-[#fe5144] border-b-2 border-[#fe5144]" : "text-[#9d9a9b]"}`}
                >
                    Short
                </button>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-row mb-4">
                    <div className="order-selection w-8/12 flex flex-col">
                        <label htmlFor="orderType" className="text-[#f3f0ef] w-full ">Order Type</label>
                        <select id="orderType" className="w-full bg-[#1a1a1a] focus:outline-none p-3 my-1">
                            <option value="market">MARKET</option>
                            <option value="limit">LIMIT</option>
                        </select>
                    </div>
                    <div className='open-price flex flex-col w-4/12 ml-2'>
                        <span className="">Open Price</span>
                        <span className="text-[#f3f0ef] ">30,021.29 USCD</span>
                    </div>
                </div>
                <div className="flex flex-col mb-4">
                    <label htmlFor="size" className="text-[#f3f0ef] ">Size</label>
                    <div className="w-full flex items-center">
                        <input
                            id="size"
                            className="w-9/12 bg-[#1a1a1a] focus:outline-none p-3 my-1"
                            type="text" placeholder="0."
                            value={size}
                            onChange={(e) => setSize(parseFloat(e.target.value) || "")} />
                        <span className="w-3/12 bg-[#1a1a1a] my-1 p-3 text-center">USDC</span>
                    </div>
                    <span className="">Up to 1,458.173</span>
                </div>
                <div className="w-full max-w-md mx-auto mb-4">
                    <div className="flex justify-between text-gray-400 mb-2">
                        <label className="text-lg">Leverage</label>
                        <span className="text-lg font-semibold text-white">{formatLeverage(leverage)}</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="128"
                        step="1"
                        value={leverage}
                        onChange={handleLeverageSelection}
                        list="leverage-markers"
                        className="w-full appearance-none bg-[#1a1a1a] rounded-large outline-none"
                    />
                    <datalist id="leverage-markers">
                        {leverageMarks.map((mark) => (
                            <option key={mark} value={mark} label={`${mark}X`} />
                        ))}
                    </datalist>
                    <div className="flex justify-between text-gray-400 mt-2">
                        {leverageMarks.map((mark) => (
                            <span key={mark} className="text-sm">
                                {mark}X
                            </span>
                        ))}
                    </div>
                </div>
                <div className="mb-4">
                    <div className="flex my-1">
                        <span className="w-7/12">Liquidation Price</span>
                        <span className="w-5/12 text-[#f3f0ef] text-right">300,212 USDC</span>
                    </div>
                    <div className="flex my-1">
                        <span className="w-5/12">Slippage</span>
                        <span className="w-7/12 text-[#f3f0ef] text-right">1.20 USDC (0.3%)</span>
                    </div>
                    <div className="flex my-1">
                        <span className="w-5/12">Fee</span>
                        <span className="w-7/12 text-[#f3f0ef] text-right">2.00 USDC (0.05%)</span>
                    </div>
                </div>
                <select id="" className="w-full bg-[#171513] focus:outline-none mb-4">
                    <option value="Advanced">Advanced</option>
                    <option value="Light">Light</option>
                </select>
                <button
                    type="submit"
                    ref={buttonRef}
                    onClick={handleSubmit}
                    className="p-3 text-center w-full text-2xl bg-[#4bc2a2] text-[#1a1a1a] rounded"
                >
                    Buy / {orderType.charAt(0).toUpperCase() + orderType.slice(1)}
                </button>
            </form>
            {showConfetti && (
                    <Confetti
                        width={window.innerWidth}
                        height={window.innerHeight}
                        numberOfPieces={1000}
                        gravity={0}
                        initialVelocityY={{ min: -5, max: -10 }}
                        colors={['#4bc2a2']}
                        confettiSource={{
                            x: 0 , y: buttonPosition.y, w: buttonPosition.w, h: buttonPosition.h
                        }}
                    />
                )}
        </div>
    );
};

export default OrderForm;
