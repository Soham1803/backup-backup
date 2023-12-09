import PushChatGroup from "@/components/chat/PushChatGroup";
import PushChatNoGroup from "@/components/chat/PushChatNoGroup";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-row items-center justify-between p-24">
      <div className="flex items-start w-2/5">
      <PushChatNoGroup />
      </div>
      <div className="flex items-start w-2/5">
      <PushChatGroup />
      </div>
      <br />
    </main>
  );
}
