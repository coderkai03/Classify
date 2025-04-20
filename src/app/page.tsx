import Chatbot from "@/components/chatbot/chatbot";
import Flowchart from "@/components/flowchart/flowchart";

// TODO add shadcn/ui resizable component here https://ui.shadcn.com/docs/components/resizable

export default function Home() {
  return (
    <div className="flex h-full">
      <Chatbot />
      <Flowchart />
    </div>
  );
}
