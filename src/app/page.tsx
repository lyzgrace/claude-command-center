import ReactMarkdown, { type Components } from "react-markdown";
import { supabase } from "@/lib/supabase";

const markdownComponents: Components = {
  h2: ({ children }) => (
    <h3 className="mt-4 mb-2 text-base font-semibold text-zinc-900 first:mt-0 dark:text-zinc-50">
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className="mt-3 mb-1 text-sm font-semibold text-zinc-800 dark:text-zinc-200">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-2 ml-4 list-disc space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
      {children}
    </ul>
  ),
  li: ({ children }) => <li>{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-zinc-900 dark:text-zinc-100">
      {children}
    </strong>
  ),
};

const sources = [
  { title: "Inbox", description: "Gmail & Outlook" },
  { title: "Calendar", description: "Upcoming events" },
  { title: "Messages", description: "Slack DMs" },
  { title: "Tasks", description: "Notion tasks" },
];

const BRIEFING_TIMEZONE = "America/New_York";

function getTodayDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BRIEFING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function getTodaysBriefing() {
  const today = getTodayDate();

  const { data } = await supabase
    .from("daily_briefings")
    .select("summary, date")
    .eq("date", today)
    .single();

  return data;
}

export default async function Home() {
  const briefing = await getTodaysBriefing();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
          Command Center
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Your work and personal life, in one place.
        </p>

        <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Today&apos;s briefing
          </h2>
          {briefing ? (
            <div className="mt-2">
              <ReactMarkdown components={markdownComponents}>
                {briefing.summary}
              </ReactMarkdown>
            </div>
          ) : (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              No briefing yet for today — check back once your automation runs.
            </p>
          )}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {sources.map((source) => (
            <div
              key={source.title}
              className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                {source.title}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {source.description}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
