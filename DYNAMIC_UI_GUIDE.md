# Dynamic UI Generation with Vercel AI SDK

This guide explains how to implement dynamic UI generation (flowcharts, tables, and info cards) in your AI-powered application using the Vercel AI SDK.

## Implemented Approach: Client-Side Tool UI Rendering

We've implemented the **client-side rendering approach**, which works seamlessly with your existing Agent API setup.

### How It Works

1. **Tools Return Structured Data**: Each tool (`flowchartTool`, `tableTool`, `infoCardTool`) returns a JSON object with a `type` field and relevant data
2. **Client Detects Tool Outputs**: The chat component checks for tool invocations in message parts
3. **Dynamic Component Rendering**: Based on the `type` field, the appropriate React component is rendered

### Architecture

```
User Message → Agent → Tool Invocation → Tool Returns Data → 
Client Receives Tool Output → Renders Appropriate UI Component
```

### Available Tools

#### 1. FlowchartTool
**Use Case**: Course sequences, prerequisite visualization, degree pathways

**Example**:
```typescript
{
  type: "flowchart",
  title: "CS Major Course Sequence",
  courses: [
    {
      id: "CS010A",
      name: "Introduction to Computer Science",
      prerequisites: [],
      semester: 1
    },
    {
      id: "CS010B",
      name: "Intermediate Computer Science",
      prerequisites: ["CS010A"],
      semester: 2
    }
  ]
}
```

#### 2. TableTool
**Use Case**: Course comparisons, structured data display, schedules

**Example**:
```typescript
{
  type: "table",
  title: "CS Course Comparison",
  headers: ["Course ID", "Title", "Units", "Prerequisites"],
  rows: [
    ["CS010A", "Intro to CS", "4", "None"],
    ["CS010B", "Intermediate CS", "4", "CS010A"]
  ]
}
```

#### 3. InfoCardTool
**Use Case**: Warnings, tips, important notices, highlights

**Example**:
```typescript
{
  type: "info-card",
  title: "Important Prerequisite Notice",
  content: "You must complete CS010A before enrolling in CS010B",
  variant: "warning",
  metadata: {
    "Enforced By": "System",
    "Exception Process": "Contact department advisor"
  }
}
```

### Testing It Out

Try these example prompts:

1. **Flowchart**: "Show me the course sequence for the CS major first year"
2. **Table**: "Compare CS010A, CS010B, and CS010C in a table"
3. **Info Card**: "Give me important information about prerequisite requirements"

### File Structure

```
src/
├── lib/
│   ├── agent.ts                          # Agent configuration with all tools
│   └── tools/
│       ├── flowchartTool.ts              # Flowchart generation tool
│       ├── tableTool.ts                  # Table generation tool
│       └── infoCardTool.ts               # Info card generation tool
├── components/
│   ├── chatbot/
│   │   └── chat-messages.tsx             # Updated to render tool outputs
│   └── tool-displays/
│       ├── flowchart-display.tsx         # Flowchart UI component
│       ├── table-display.tsx             # Table UI component
│       └── info-card-display.tsx         # Info card UI component
└── app/
    └── api/
        └── chat/
            └── route.ts                   # API route (no changes needed)
```

## Alternative Approach: Server-Side UI Rendering with `streamUI`

If you want the server to render React components directly (more advanced), you can use the `streamUI` function from `@ai-sdk/rsc`. This approach:

- ✅ Renders React components on the server
- ✅ Streams them directly to the client
- ✅ Reduces client-side complexity
- ❌ Requires migration from Agent API to `streamUI`
- ❌ More complex server setup

### Server-Side Example

```typescript
// app/actions.ts (Server Action)
'use server';

import { streamUI } from '@ai-sdk/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { FlowchartDisplay } from '@/components/tool-displays/flowchart-display';

export async function generateResponse(message: string) {
  const result = await streamUI({
    model: openai('gpt-4o'),
    system: 'You are a college counselor assistant',
    messages: [{ role: 'user', content: message }],
    text: ({ content }) => <p>{content}</p>,
    tools: {
      generateFlowchart: {
        description: 'Generate a course flowchart',
        inputSchema: z.object({
          title: z.string(),
          courses: z.array(z.object({
            id: z.string(),
            name: z.string(),
            prerequisites: z.array(z.string()),
            semester: z.number().optional(),
          })),
        }),
        generate: async function* ({ title, courses }) {
          // Show loading state
          yield <div>Generating flowchart...</div>;
          
          // Return the actual component
          return <FlowchartDisplay title={title} courses={courses} />;
        },
      },
    },
  });

  return result.value;
}
```

```tsx
// Client component
'use client';

import { useState } from 'react';
import { generateResponse } from './actions';

export default function Chat() {
  const [generation, setGeneration] = useState<React.ReactNode>();

  return (
    <div>
      <div>{generation}</div>
      <form onSubmit={async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const input = formData.get('message') as string;
        const result = await generateResponse(input);
        setGeneration(result);
      }}>
        <input name="message" />
        <button>Send</button>
      </form>
    </div>
  );
}
```

## Extending the System

### Adding a New Tool Type

1. **Create the tool** in `src/lib/tools/yourTool.ts`:
```typescript
import { tool } from "ai";
import { z } from "zod";

export const yourTool = tool({
  description: "Description of what your tool does",
  parameters: z.object({
    // Define your parameters
  }),
  execute: async (params) => {
    return {
      type: "your-tool-type",
      // Your data structure
    };
  },
});
```

2. **Create the UI component** in `src/components/tool-displays/your-display.tsx`:
```tsx
'use client';

export function YourDisplay({ data }: YourDisplayProps) {
  return <div>{/* Your UI */}</div>;
}
```

3. **Register the tool** in `src/lib/agent.ts`:
```typescript
import { yourTool } from "./tools/yourTool";

export const agent = new Agent({
  // ...
  tools: {
    // existing tools...
    yourTool: yourTool,
  },
});
```

4. **Add rendering logic** in `src/components/chatbot/chat-messages.tsx`:
```typescript
import { YourDisplay } from "@/components/tool-displays/your-display";

// In renderToolOutput function:
if (output.type === 'your-tool-type') {
  return <YourDisplay key={key} {...output} />;
}
```

## Best Practices

1. **Type Safety**: Always define proper TypeScript interfaces for your tool outputs
2. **Loading States**: Show skeletons or loading indicators while tools are executing
3. **Error Handling**: Add error boundaries around tool output components
4. **Responsive Design**: Ensure all UI components work on mobile devices
5. **Accessibility**: Add proper ARIA labels and keyboard navigation
6. **Performance**: Use React.memo() for expensive tool output components

## Comparison: Client-Side vs Server-Side

| Feature | Client-Side (Current) | Server-Side (streamUI) |
|---------|----------------------|------------------------|
| Setup Complexity | ✅ Simple | ⚠️ Moderate |
| Agent API Compatible | ✅ Yes | ❌ No (requires migration) |
| Bundle Size | ⚠️ All components in client | ✅ Components streamed as needed |
| Interactivity | ✅ Full React hooks available | ⚠️ Limited to server components |
| Real-time Updates | ✅ Easy | ✅ Built-in streaming |
| Type Safety | ✅ Excellent | ✅ Excellent |

## Resources

- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [AI SDK RSC Guide](https://sdk.vercel.ai/docs/ai-sdk-rsc)
- [Tool Calling Documentation](https://sdk.vercel.ai/docs/ai-sdk-core/tools-and-tool-calling)
- [Agent API Reference](https://sdk.vercel.ai/docs/reference/ai-sdk-ui/agent)

## Troubleshooting

### Tool output not rendering
- Check that the tool's `execute` function returns an object with a `type` field
- Verify the `renderToolOutput` function in `chat-messages.tsx` handles that type
- Check browser console for any errors

### Components not found
- Ensure all component imports are correct
- Verify files are in the correct directories
- Check that shadcn/ui components are properly installed

### Styling issues
- Make sure Tailwind CSS is properly configured
- Check that dark mode variants are working
- Verify card components from shadcn/ui are installed

