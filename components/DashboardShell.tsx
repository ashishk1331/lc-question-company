/**
 * Mobile keeps the single column (analytics first, directory below). From lg up
 * the directory becomes a persistent left rail and the analytics get the canvas.
 */
export default function DashboardShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-7 lg:grid lg:grid-cols-[288px_minmax(0,1fr)] lg:items-start lg:gap-0">
      <main className="order-1 min-w-0 lg:order-2 lg:pb-12 lg:pl-8 lg:pt-6">
        {children}
      </main>
      <aside className="order-2 lg:sticky lg:order-1 lg:top-[var(--header-h)] lg:h-[calc(100dvh-var(--header-h))] lg:border-r lg:border-hairline lg:pr-6 lg:pt-6">
        {sidebar}
      </aside>
    </div>
  );
}
