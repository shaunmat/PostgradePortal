export const ChatBubble = ({ message, isSent }) => {
    return (
        <div className={`flex items-end gap-2.5 ${isSent ? 'justify-end' : ''}`}>
            {!isSent && <img className="w-8 h-8 rounded-full self-end" src={message.avatar} alt="User image" />}
            <div className={`flex flex-col w-full max-w-[250px] p-4 border rounded-xl ${isSent ? 'bg-blue-100 dark:bg-blue-700 rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none'}`}>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    {/* <span className="text-sm font-semibold text-gray-900 dark:text-white">{message.sender}</span> */}
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{message.time}</span>
                </div>
                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message.content}</p>
                {message.status && <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{message.status}</span>}
            </div>
            {isSent && <img className="w-8 h-8 rounded-full self-end" src={message.avatar} alt="User image" />}
        </div>
    );
};