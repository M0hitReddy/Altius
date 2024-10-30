export default function HeaderLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="200" cy="150" r="120" fill="#E9D5FF" />
      <path
        d="M280 150C280 194.183 244.183 230 200 230C155.817 230 120 194.183 120 150C120 105.817 155.817 70 200 70"
        stroke="#9333EA"
        strokeWidth="6"
      />
      <circle cx="200" cy="150" r="80" stroke="#9333EA" strokeWidth="6" />
      <path d="M200 70V150L280 110" stroke="#9333EA" strokeWidth="6" />
      <circle cx="200" cy="150" r="15" fill="#9333EA" />
      <circle cx="50" cy="50" r="20" fill="#FDE68A" />
      <circle cx="350" cy="250" r="30" fill="#FDE68A" />
      <path d="M50 250L80 220M65 265L95 235" stroke="#9333EA" strokeWidth="4" />
      <path d="M320 80L350 50M335 95L365 65" stroke="#9333EA" strokeWidth="4" />
    </svg>
  );
}
