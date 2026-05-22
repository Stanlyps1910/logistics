import { motion } from "framer-motion";

export default function Logo({ 
  className = "", 
  iconOnly = false, 
  animated = false, 
  duration = 1.5 
}) {
  const brandGreen = "#004c29"; // Exact forest green color from logo branding

  // SVG dimensions
  const width = iconOnly ? 160 : 480;
  const height = 160;
  const viewBox = iconOnly ? "0 0 160 160" : "0 0 480 160";

  // Animation variants
  const badgeVariants = animated ? {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.8 }
    }
  } : {};

  const capsuleVariants = animated ? {
    hidden: { width: 80, opacity: 0 },
    visible: { 
      width: 380, 
      opacity: 1,
      transition: { delay: 0.4, duration: 0.8, ease: "easeOut" }
    }
  } : {};

  const textVariants = animated ? {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { delay: 1.0, duration: 0.5, ease: "easeOut" }
    }
  } : {};

  const lineVariants = animated ? {
    hidden: { pathLength: 0 },
    visible: { 
      pathLength: 1,
      transition: { delay: 0.6, duration: 0.8, ease: "easeInOut" }
    }
  } : {};

  const truckVariants = animated ? {
    hidden: { x: -30, opacity: 0 },
    visible: { 
      x: 0, 
      opacity: 1,
      transition: { delay: 0.8, duration: 0.6, type: "spring", stiffness: 120 }
    }
  } : {};

  const speedLineVariants = animated ? {
    hidden: { scaleX: 0, opacity: 0 },
    visible: { 
      scaleX: 1, 
      opacity: 1,
      transition: { delay: 1.2, duration: 0.4, ease: "easeOut" }
    }
  } : {};

  const renderTruckIcon = () => (
    <g id="truck-icon">
      {/* Speed lines */}
      <motion.path 
        d="M 48 72 L 54 72" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        variants={speedLineVariants}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      />
      <motion.path 
        d="M 42 80 L 54 80" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        variants={speedLineVariants}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      />
      <motion.path 
        d="M 46 88 L 54 88" 
        stroke="white" 
        strokeWidth="2.5" 
        strokeLinecap="round"
        variants={speedLineVariants}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      />

      {/* Truck Body Group */}
      <motion.g
        variants={truckVariants}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      >
        {/* Cargo Box */}
        <path 
          d="M 58 92 V 62 C 58 60.5 59.5 59 61 59 H 91 C 92.5 59 94 60.5 94 62 V 92 Z" 
          stroke="white" 
          strokeWidth="2.5" 
          fill="none"
          strokeLinejoin="round"
        />

        {/* Cabin Outline */}
        <path 
          d="M 94 71 H 101 C 103 71 105 72 106.5 73.5 L 112.5 81.5 C 113.5 83 114 84.5 114 86.5 V 92 H 94" 
          stroke="white" 
          strokeWidth="2.5" 
          fill="none"
          strokeLinejoin="round"
        />

        {/* Cabin Window */}
        <path 
          d="M 97 74 H 100 C 101 74 101.8 74.4 102.3 75.1 L 106.8 81.1 C 107.3 81.7 107.3 82.5 106.8 83.1 C 106.5 83.5 106 83.7 105.5 83.7 H 97 Z" 
          stroke="white" 
          strokeWidth="2" 
          fill="none"
          strokeLinejoin="round"
        />

        {/* Wheels */}
        {/* Rear Wheel */}
        <circle 
          cx="70" 
          cy="93" 
          r="6.5" 
          fill={brandGreen} 
          stroke="white" 
          strokeWidth="2.5" 
        />
        <circle cx="70" cy="93" r="1.8" fill="white" />

        {/* Front Wheel */}
        <circle 
          cx="102" 
          cy="93" 
          r="6.5" 
          fill={brandGreen} 
          stroke="white" 
          strokeWidth="2.5" 
        />
        <circle cx="102" cy="93" r="1.8" fill="white" />
      </motion.g>
    </g>
  );

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={viewBox} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
    >
      {!iconOnly && (
        <g id="logo-capsule-group">
          {/* Main Capsule Banner Background */}
          <motion.path 
            d="M 80 43 H 425 C 445 43 461 59 461 79 V 81 C 461 101 445 117 425 117 H 80 Z" 
            fill={brandGreen}
            variants={capsuleVariants}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
          />

          {/* Capsule Inner White Border Contour */}
          <motion.path 
            d="M 130 51 H 425 C 441 51 453 63 453 79 V 81 C 453 97 441 109 425 109 H 130" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round"
            fill="none"
            variants={lineVariants}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
          />

          {/* Rebranded Text Group */}
          <motion.g
            variants={textVariants}
            initial={animated ? "hidden" : undefined}
            animate={animated ? "visible" : undefined}
          >
            {/* SRI RANGA LOGISTICS Title */}
            <text 
              x="154" 
              y="79" 
              fill="white" 
              fontSize="24" 
              fontWeight="900" 
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              letterSpacing="0.05em"
            >
              SRI RANGA LOGISTICS
            </text>

            {/* Tagline */}
            <text 
              x="154" 
              y="99" 
              fill="white" 
              fontSize="10" 
              fontWeight="700" 
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              letterSpacing="0.1em"
            >
              FAST MOVES, SAFE STORAGE, TRUSTED DELIVERY.
            </text>
          </motion.g>
        </g>
      )}

      {/* Circular Badge Group */}
      <motion.g 
        id="logo-circle-group"
        variants={badgeVariants}
        initial={animated ? "hidden" : undefined}
        animate={animated ? "visible" : undefined}
      >
        {/* Outer Circular Container */}
        <circle cx="80" cy="80" r="63" fill={brandGreen} />
        {/* White Border Ring */}
        <circle cx="80" cy="80" r="57" stroke="white" strokeWidth="3.5" fill="none" />
        
        {/* Truck Icon and Speed Lines */}
        {renderTruckIcon()}
      </motion.g>
    </svg>
  );
}
