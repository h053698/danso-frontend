export function CatMascot({ size = 220 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="단소 마스코트 고양이"
    >
      {/* keyboard */}
      <rect x="20" y="140" width="160" height="40" rx="8" fill="#3A3A3A" />
      <rect x="30" y="150" width="18" height="12" rx="3" fill="#5A5A5A" />
      <rect x="54" y="150" width="18" height="12" rx="3" fill="#5A5A5A" />
      <rect x="78" y="150" width="18" height="12" rx="3" fill="#5A5A5A" />
      <rect x="102" y="150" width="18" height="12" rx="3" fill="#5A5A5A" />
      <rect x="126" y="150" width="18" height="12" rx="3" fill="#5A5A5A" />
      <rect x="150" y="150" width="18" height="12" rx="3" fill="#5A5A5A" />
      {/* body */}
      <ellipse cx="100" cy="120" rx="42" ry="34" fill="#E8B830" />
      {/* head */}
      <circle cx="100" cy="78" r="40" fill="#F0C848" />
      {/* ears */}
      <path d="M66 52 L60 22 L88 44 Z" fill="#F0C848" />
      <path d="M134 52 L140 22 L112 44 Z" fill="#F0C848" />
      <path d="M70 48 L67 32 L82 44 Z" fill="#E8A0B0" />
      <path d="M130 48 L133 32 L118 44 Z" fill="#E8A0B0" />
      {/* detective cap */}
      <path d="M58 60 Q100 20 142 60 L142 52 Q100 12 58 52 Z" fill="#7B6A4A" />
      <ellipse cx="100" cy="48" rx="46" ry="18" fill="#8A7854" />
      <rect x="54" y="56" width="92" height="10" rx="5" fill="#6A5A3E" />
      {/* eyes */}
      <circle cx="85" cy="80" r="6" fill="#2D2D2D" />
      <circle cx="115" cy="80" r="6" fill="#2D2D2D" />
      <circle cx="87" cy="78" r="2" fill="#FFF" />
      <circle cx="117" cy="78" r="2" fill="#FFF" />
      {/* nose + mouth */}
      <path d="M97 90 L103 90 L100 94 Z" fill="#E8788A" />
      <path d="M100 94 Q94 100 88 96" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M100 94 Q106 100 112 96" stroke="#2D2D2D" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* whiskers */}
      <line x1="62" y1="84" x2="80" y2="86" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
      <line x1="62" y1="92" x2="80" y2="92" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
      <line x1="138" y1="84" x2="120" y2="86" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
      <line x1="138" y1="92" x2="120" y2="92" stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" />
      {/* paws on keyboard */}
      <ellipse cx="70" cy="142" rx="12" ry="9" fill="#F0C848" />
      <ellipse cx="130" cy="142" rx="12" ry="9" fill="#F0C848" />
    </svg>
  )
}
