# Quick Start: Dynamic UI Generation

## ✅ What's Been Implemented

Your app now supports **dynamic UI generation** for:
- 📊 **Flowcharts** - Course sequences and prerequisites
- 📋 **Tables** - Course comparisons and structured data  
- 💡 **Info Cards** - Highlights, warnings, and tips

## 🚀 Getting Started

### 1. Start your dev server
```bash
npm run dev
```

### 2. Try these example prompts in the chat:

**Flowchart Example:**
> "Show me the prerequisite chain for CS180"

**Table Example:**
> "Compare CS010A, CS010B, and CS014 in a table"

**Info Card Example:**
> "What are important prerequisite policies I should know?"

**Multi-Tool Example:**
> "I'm a freshman CS major, show me my first year plan"

## 📁 Files Modified/Created

### New Tool Files
- `src/lib/tools/flowchartTool.ts` - Flowchart generation
- `src/lib/tools/tableTool.ts` - Table generation  
- `src/lib/tools/infoCardTool.ts` - Info card generation

### New UI Components
- `src/components/tool-displays/flowchart-display.tsx`
- `src/components/tool-displays/table-display.tsx`
- `src/components/tool-displays/info-card-display.tsx`

### Modified Files
- `src/lib/agent.ts` - Added new tools to agent
- `src/components/chatbot/chat-messages.tsx` - Added tool output rendering

## 🎨 How It Works

```
User Types Message
       ↓
Agent Processes with LLM
       ↓
LLM Decides to Use Tool (e.g., generateFlowchart)
       ↓
Tool Returns Structured Data
       ↓
Client Receives Tool Output
       ↓
chat-messages.tsx Detects Tool Type
       ↓
Renders Appropriate UI Component
       ↓
User Sees Beautiful Visualization! 🎉
```

## 🔧 Customization

### Change When Tools Are Used
Edit the system prompt in `src/lib/agent.ts`:
```typescript
const systemPrompt = `...
Use tools strategically:
- ALWAYS use flowcharts for prerequisite questions
- Use tables when comparing 2+ items
...`;
```

### Modify Tool Styling
Edit the component files in `src/components/tool-displays/`:
- Change colors in className props
- Adjust layout and spacing
- Add animations or transitions

### Add New Tool Types
See `DYNAMIC_UI_GUIDE.md` section "Extending the System"

## 📚 Documentation

- **`DYNAMIC_UI_GUIDE.md`** - Complete implementation guide
- **`EXAMPLE_USAGE.md`** - Real-world examples and test cases
- **`QUICK_START.md`** - This file

## 🆚 Client-Side vs Server-Side

**Current Implementation**: Client-Side ✅
- ✅ Simple setup
- ✅ Works with your existing Agent API
- ✅ Full React interactivity
- ✅ Type-safe

**Alternative**: Server-Side (streamUI)
- More complex setup
- Requires migrating from Agent API
- Components rendered on server
- See `DYNAMIC_UI_GUIDE.md` for details

## 🐛 Troubleshooting

### Tool not rendering?
1. Check browser console for errors
2. Verify tool returns object with `type` field
3. Check `renderToolOutput()` in `chat-messages.tsx`

### Styling broken?
1. Ensure Tailwind CSS is running
2. Verify shadcn/ui components installed
3. Check dark mode configuration

### AI not using tools?
1. Try more explicit prompts ("show me in a table...")
2. Adjust system prompt to encourage tool usage
3. Check that tools are registered in `agent.ts`

## 🎯 Next Steps

1. **Test the implementation** with the example prompts above
2. **Customize the styling** to match your app's design
3. **Add more tool types** (charts, calendars, timelines, etc.)
4. **Integrate with your flowchart** - Connect tool outputs to the flowchart component
5. **Add user interactions** - Make tables sortable, flowcharts interactive, etc.

## 💡 Pro Tips

- Tools work best with **clear, specific prompts**
- The AI can **combine multiple tools** in a single response
- Tool outputs are **fully customizable** - edit the display components
- You can create **as many tool types** as you need
- Consider adding **loading animations** for better UX

## 🔗 Resources

- [Vercel AI SDK Docs](https://sdk.vercel.ai/docs)
- [Tool Calling Guide](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)
- [Agent API Reference](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/agent)

---

**Ready to test?** Start your dev server and try a prompt! 🚀

