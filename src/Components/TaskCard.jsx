import React from 'react'

const TaskCard = ({ bgColor, icon, title, badge, value, active, onClick, tooltip }) => {
    return (
        <div
            className={` relative flex flex-row  p-5 gap-[11px] rounded-[11px] border ease-in-out duration-75 cursor-pointer  ${active ? "border-[#19BEEC] border-2 " : ""}`}>
            {/* <div className={` ${""} rounded-[6px]  items-center justify-center flex`}>
                {icon}
            </div> */}
            <div className="flex flex-col  font-semibold text-[#626164]">
                <p className="text-base font-bold text-[#333b47] flex items-center gap-2">
                    {title}
                    {
                    badge ? 
                    <>
                        <span className={`border rounded-full px-2 py-1 text-xs font-[600] ${badge.className}`}>{badge?.label}</span>
                    </>
                    :
                    <></>
                    }
                </p>
                <p className="text-5xl font-[800] text-black">{value || 0}</p>
            </div>
            <span className={` ${active ? "opacity-100 absolute " : "opacity-0 "} ease-in-out duration-75   -top-2.5 -right-2.5 bg-white`}>
                <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} viewBox="0 0 512 512"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" fill='#19BEEC' /></svg>
            </span>
        </div>
    )
}

export default TaskCard