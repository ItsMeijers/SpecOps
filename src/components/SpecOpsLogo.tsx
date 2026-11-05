export function SpecOpsLogo({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 68 76" role="img" aria-label="SpecOps logo">
      <defs>
        <linearGradient id="specops-mark-top" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#ff9624"/><stop offset="1" stopColor="#ff5b00"/></linearGradient>
        <linearGradient id="specops-mark-right" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#ff8314"/><stop offset="1" stopColor="#d94000"/></linearGradient>
      </defs>
      <path fill="url(#specops-mark-top)" d="M34 0 67 19 50 29 34 20 17 29 0 19Z"/>
      <path fill="#ff7410" d="M0 19 17 29 17 48 0 58Z"/>
      <path fill="#ff9d19" d="M0 58 17 48 34 57 34 76Z"/>
      <path fill="url(#specops-mark-right)" d="M67 19 50 29 50 48 34 57 34 76 67 57Z"/>
    </svg>
  );
}
