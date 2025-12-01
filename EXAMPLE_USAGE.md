# Example Usage of Dynamic UI Tools

This document shows practical examples of how the AI agent will use the dynamic UI tools to respond to user queries.

## Example 1: Course Sequence Visualization

**User Query**: "Show me the prerequisite chain for CS180 (Algorithm Design)"

**AI Response**:
- Text: "Here's the prerequisite chain for CS180. You'll need to complete these courses in order:"
- Tool: `generateFlowchart`
- Tool Output: Flowchart showing CS010A → CS010B → CS014 → CS180

**What the user sees**:
```
Assistant: Here's the prerequisite chain for CS180. You'll need to complete these courses in order:

┌────────────────────────────────────────┐
│  CS Major Prerequisites for CS180      │
├────────────────────────────────────────┤
│  CS010A: Intro to CS                   │
│  Semester 1 • Prerequisites: None      │
├────────────────────────────────────────┤
│  CS010B: Intermediate CS               │
│  Semester 2 • Prerequisites: CS010A    │
├────────────────────────────────────────┤
│  CS014: Data Structures                │
│  Semester 3 • Prerequisites: CS010B    │
├────────────────────────────────────────┤
│  CS180: Algorithm Design               │
│  Semester 4 • Prerequisites: CS014     │
└────────────────────────────────────────┘
```

---

## Example 2: Course Comparison Table

**User Query**: "Compare CS010A, CS010B, and CS014 - show me the units, prerequisites, and when to take them"

**AI Response**:
- Text: "Here's a comparison of those three foundational CS courses:"
- Tool: `generateTable`
- Tool Output: Table with structured comparison

**What the user sees**:
```
Assistant: Here's a comparison of those three foundational CS courses:

┌──────────────────────────────────────────────────────────┐
│  Computer Science Core Course Comparison                  │
├──────────┬──────────────────┬───────┬──────────┬─────────┤
│ Course   │ Title            │ Units │ Prereqs  │ Semester│
├──────────┼──────────────────┼───────┼──────────┼─────────┤
│ CS010A   │ Intro to CS      │   4   │ None     │    1    │
│ CS010B   │ Intermediate CS  │   4   │ CS010A   │    2    │
│ CS014    │ Data Structures  │   4   │ CS010B   │    3    │
└──────────┴──────────────────┴───────┴──────────┴─────────┘
```

---

## Example 3: Important Notice Card

**User Query**: "Can I take CS180 if I'm currently in CS014?"

**AI Response**:
- Text: "No, you need to complete CS014 first."
- Tool: `generateInfoCard`
- Tool Output: Warning card explaining prerequisite policy

**What the user sees**:
```
Assistant: No, you need to complete CS014 first.

┌────────────────────────────────────────────────┐
│ ⚠️  Prerequisite Requirement                   │
├────────────────────────────────────────────────┤
│  You must successfully complete CS014 (Data    │
│  Structures) with a passing grade before you   │
│  can enroll in CS180. Prerequisites are        │
│  strictly enforced by the system.              │
│                                                 │
│  ─────────────────────────────────────────────│
│  Enforced By: Registration System              │
│  Exception Process: Contact CS dept advisor    │
└────────────────────────────────────────────────┘
```

---

## Example 4: Multi-Tool Response

**User Query**: "I'm a CS major starting next semester. What's my 4-year plan?"

**AI Response** (uses multiple tools):

1. **Text**: "Great question! Let me show you a typical 4-year plan for CS majors."

2. **InfoCard** (type: info):
   - Title: "CS Major Overview"
   - Content: "The CS major requires 180 units total, with 40 units in core CS courses..."

3. **Flowchart**:
   - Shows semester-by-semester course progression for Years 1-2

4. **Table**:
   - Breakdown of unit distribution across course categories

5. **InfoCard** (type: success):
   - Title: "Getting Started"
   - Content: "Your first semester should include CS010A, MATH009A, and ENGL001A..."

**What the user sees**:
```
Assistant: Great question! Let me show you a typical 4-year plan for CS majors.

[INFO CARD - Blue border]
ℹ️ CS Major Overview
The CS major requires 180 units total, with 40 units in core CS courses,
including required math, electives, and general education requirements.

[FLOWCHART]
First Year Course Sequence
- Fall: CS010A, MATH009A, ENGL001A
- Winter: CS010B, MATH009B, GE Course
- Spring: CS014, MATH010A, GE Course
...

[TABLE]
Unit Distribution by Category
Core CS: 40 units
Math: 20 units
Electives: 16 units
GE Requirements: 104 units
Total: 180 units

[INFO CARD - Green border]
✓ Getting Started
Your first semester should include CS010A (Intro to CS), MATH009A (Calculus),
and ENGL001A (Composition). Register early as CS010A fills up quickly!
```

---

## Example 5: Complex Flowchart

**User Query**: "Show me all the CS electives I can take after completing CS014"

**AI Response**:
- Text: "After CS014, you have several elective options:"
- Tool: `generateFlowchart` with branching paths
- Tool Output: Flowchart showing CS014 → [CS110, CS120, CS130, CS140]

**What the user sees**:
```
Assistant: After CS014, you have several elective options:

┌─────────────────────────────────────────────────┐
│  CS Electives Available After CS014             │
├─────────────────────────────────────────────────┤
│  CS014: Data Structures [COMPLETED]             │
│  Prerequisites: CS010B                          │
├─────────────────────────────────────────────────┤
│  CS110: Computer Architecture                   │
│  Semester 4+ • Prerequisites: CS014             │
├─────────────────────────────────────────────────┤
│  CS120: Software Engineering                    │
│  Semester 4+ • Prerequisites: CS014             │
├─────────────────────────────────────────────────┤
│  CS130: Operating Systems                       │
│  Semester 5+ • Prerequisites: CS014, CS110      │
├─────────────────────────────────────────────────┤
│  CS140: Databases                               │
│  Semester 4+ • Prerequisites: CS014             │
└─────────────────────────────────────────────────┘
```

---

## Testing Your Implementation

Run your development server and try these test prompts:

### Test 1: Basic Flowchart
```
User: "Show me the courses I need for a CS major"
Expected: Flowchart with key CS courses
```

### Test 2: Basic Table
```
User: "Compare CS010A and CS010B in a table"
Expected: Table with 2 rows comparing the courses
```

### Test 3: Basic Info Card
```
User: "What's important to know about CS prerequisites?"
Expected: Info card (warning or info type) with prerequisite policy
```

### Test 4: Mixed Response
```
User: "I want to take CS180 next quarter, what do I need?"
Expected: Text explanation + flowchart of prerequisites + info card with enrollment tips
```

### Test 5: Complex Query
```
User: "I'm a freshman CS major. Show me my first year plan with all the details"
Expected: Multiple tools - info card (welcome), flowchart (year 1 courses), table (unit breakdown)
```

---

## How the AI Decides Which Tool to Use

The AI agent uses the tool descriptions to decide when to invoke each tool:

### Flowchart Tool
- **Triggers**: "show me", "visualize", "course sequence", "prerequisite chain", "pathway", "roadmap"
- **Best for**: Sequential relationships, prerequisites, semester planning

### Table Tool
- **Triggers**: "compare", "table", "list", "side by side", "breakdown"
- **Best for**: Comparing multiple items, structured data, course details

### Info Card Tool
- **Triggers**: "important", "warning", "tip", "notice", "remember", "highlight"
- **Best for**: Emphasis, warnings, tips, policy information

---

## Customizing Tool Behavior

You can guide the AI's tool usage by adjusting the system prompt in `src/lib/agent.ts`:

```typescript
const systemPrompt = `You are a college counselor assistant with advanced visualization capabilities.

Use tools strategically:
- Use flowcharts for ANY prerequisite or sequence questions
- Use tables when comparing 2+ courses or showing structured data
- Use info cards for warnings, tips, or highlighting important policies
- ALWAYS use at least one visualization tool when explaining complex topics
- Combine multiple tools for comprehensive answers

...`;
```

This gives you fine-grained control over when and how the AI uses each visualization tool.

