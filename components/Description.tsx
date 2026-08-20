type KeywordProps = {
  color: string;
  children: React.ReactNode;
};

/** The colored, dotted keyword used inside the summary sentence. */
export function Keyword({ color, children }: KeywordProps) {
  return (
    <span className="whitespace-nowrap font-medium" style={{ color }}>
      <span
        aria-hidden="true"
        className="mr-1.5 inline-block size-2 rounded-full align-middle"
        style={{ backgroundColor: color }}
      />
      {children}
    </span>
  );
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <span className="font-medium text-foreground">{children}</span>;
}

export default function Description({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-[17px] leading-[1.45] text-muted">{children}</p>;
}
