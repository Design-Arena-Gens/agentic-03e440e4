import { NextRequest } from "next/server";
import { toolCalc, toolFetch, toolHelp, toolSearch } from "@/lib/tools";

interface SimpleMessage { role: "user" | "assistant" | "system"; content: string }

function parseCommand(input: string): { cmd: string; args: string } | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith("/")) return null;
  const [first, ...rest] = trimmed.split(" ");
  const cmd = first.slice(1).toLowerCase();
  const args = rest.join(" ").trim();
  return { cmd, args };
}

async function ruleBasedAgent(latest: string): Promise<string> {
  const parsed = parseCommand(latest);
  if (parsed) {
    const { cmd, args } = parsed;
    if (cmd === "help") return toolHelp();
    if (cmd === "calc") return toolCalc(args || "");
    if (cmd === "search") return toolSearch(args || "");
    if (cmd === "fetch") return toolFetch(args || "");
    return `Unknown command: /${cmd}. Try /help.`;
  }

  // Heuristics when no slash command is used
  const lower = latest.toLowerCase();
  if (/https?:\/\//.test(latest)) return toolFetch(latest.match(/https?:\/\/\S+/)?.[0] ?? latest);
  if (/(calc|evaluate|what is|what's)/.test(lower) && /[0-9][^a-zA-Z]*[0-9]/.test(latest)) {
    const expr = latest.replace(/^.*?(calc|evaluate|what is|what's)\s*/i, "");
    return toolCalc(expr);
  }
  if (/(search|look up|find)/.test(lower)) {
    const q = latest.replace(/^.*?(search|look up|find)\s*/i, "");
    return toolSearch(q);
  }
  return "I can run tools. Try /help, or use /calc, /search, /fetch.";
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { messages: SimpleMessage[] } | undefined;
  const latest = body?.messages?.filter(Boolean).slice(-1)[0]?.content ?? "";

  // Optional: if OPENAI_API_KEY exists, you could integrate a model here.
  // To keep this deployable without secrets, we default to rule-based tools.
  const reply = await ruleBasedAgent(latest);

  return new Response(JSON.stringify({ reply }), { headers: { "Content-Type": "application/json" } });
}
