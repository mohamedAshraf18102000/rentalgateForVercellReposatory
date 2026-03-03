import { MessageCircle } from "lucide-react";

const SideToChat = () => {
  return (
    <div className="fixed z-50 bg-[#00602E]/60 w-12 h-45 top-[20%] right-0 flex items-center justify-center rounded-l-sm cursor-pointer hover:bg-[#00602E] transition-colors">
      <p className="-rotate-90 font-bold text-white whitespace-nowrap flex items-center gap-2">
        <span>
          <MessageCircle size={25} />
        </span>
        <span className="text-base">تحويل إلى محادثة</span>
      </p>
    </div>
  );
};

export default SideToChat;
