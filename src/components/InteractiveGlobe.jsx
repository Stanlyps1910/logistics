import { useEffect, useRef, useState } from "react";

// Simplified boundary coordinate database for major countries / regions
const countriesData = [
  {
    name: "India",
    label: "INDIA",
    centroid: { lat: 21.0, lon: 78.0 },
    points: [
      [8.0, 77.5], [10.0, 76.0], [13.0, 74.8], [15.0, 73.8], [19.0, 72.8], 
      [21.0, 72.5], [23.0, 68.5], [24.0, 70.0], [26.0, 71.0], [28.0, 70.5], 
      [31.0, 74.0], [33.5, 76.5], [34.0, 78.0], [31.0, 80.0], [28.0, 84.0], 
      [27.0, 88.0], [25.0, 88.0], [24.0, 92.0], [22.0, 91.5], [22.0, 88.0], 
      [20.0, 86.5], [16.0, 81.5], [10.0, 79.8], [8.0, 77.5]
    ]
  },
  {
    name: "USA",
    label: "USA",
    centroid: { lat: 38.0, lon: -97.0 },
    points: [
      [25.0, -80.0], [26.0, -80.0], [28.0, -80.5], [30.0, -81.0], [30.0, -85.0], 
      [29.0, -89.0], [29.5, -94.0], [26.0, -97.0], [26.0, -99.0], [31.8, -114.0], 
      [32.5, -117.0], [34.0, -120.5], [38.0, -123.0], [42.0, -124.2], [47.0, -124.5], 
      [49.0, -122.0], [49.0, -95.0], [48.0, -89.0], [45.0, -83.0], [42.0, -82.0], 
      [44.0, -76.0], [45.0, -71.5], [44.0, -68.0], [41.0, -71.0], [39.0, -74.0], 
      [37.0, -76.0], [32.0, -80.0], [25.0, -80.0]
    ]
  },
  {
    name: "Canada",
    label: "CANADA",
    centroid: { lat: 56.0, lon: -106.0 },
    points: [
      [49.0, -122.0], [54.0, -130.0], [59.0, -139.0], [69.0, -137.0], [72.0, -120.0], 
      [75.0, -100.0], [70.0, -80.0], [62.0, -64.0], [55.0, -55.0], [47.0, -53.0], 
      [45.0, -64.0], [45.0, -71.5], [48.0, -89.0], [49.0, -95.0], [49.0, -122.0]
    ]
  },
  {
    name: "Brazil",
    label: "BRAZIL",
    centroid: { lat: -14.0, lon: -53.0 },
    points: [
      [-5.0, -35.0], [-2.0, -40.0], [2.0, -50.0], [4.0, -51.0], [2.0, -60.0], 
      [-2.0, -65.0], [-10.0, -73.0], [-20.0, -64.0], [-28.0, -54.0], [-33.0, -53.0], 
      [-29.0, -49.0], [-23.0, -43.0], [-18.0, -39.0], [-10.0, -36.0], [-5.0, -35.0]
    ]
  },
  {
    name: "Australia",
    label: "AUSTRALIA",
    centroid: { lat: -25.0, lon: 135.0 },
    points: [
      [-33.0, 115.0], [-28.0, 114.0], [-22.0, 114.0], [-21.5, 118.0], [-18.0, 121.0], 
      [-15.0, 124.0], [-15.0, 128.0], [-12.0, 131.0], [-12.0, 136.0], [-17.0, 139.0], 
      [-14.0, 142.0], [-11.0, 142.5], [-16.0, 145.0], [-20.0, 148.0], [-25.0, 153.0], 
      [-30.0, 153.0], [-37.5, 150.0], [-38.0, 145.0], [-37.0, 140.0], [-35.0, 138.0], 
      [-34.0, 115.0]
    ]
  },
  {
    name: "China",
    label: "CHINA",
    centroid: { lat: 35.0, lon: 104.0 },
    points: [
      [22.0, 108.0], [20.0, 110.0], [22.0, 114.0], [24.0, 118.0], [29.0, 122.0], 
      [34.0, 120.0], [37.0, 119.0], [39.0, 121.0], [40.0, 124.0], [43.0, 125.0], 
      [48.0, 127.0], [53.5, 123.5], [50.0, 118.0], [45.0, 116.0], [42.5, 117.0], 
      [43.0, 85.0], [38.0, 75.0], [35.0, 74.0], [30.0, 80.0], [27.0, 86.0], 
      [28.0, 97.0], [22.0, 101.0], [22.0, 108.0]
    ]
  },
  {
    name: "Russia",
    label: "RUSSIA",
    centroid: { lat: 60.0, lon: 95.0 },
    points: [
      [53.0, 124.0], [50.0, 127.0], [43.0, 131.0], [43.0, 135.0], [46.0, 137.0], 
      [51.0, 143.0], [55.0, 155.0], [60.0, 165.0], [66.0, 170.0], [69.0, 180.0], 
      [72.0, 140.0], [77.0, 100.0], [73.0, 70.0], [68.0, 40.0], [60.0, 30.0], 
      [55.0, 37.0], [50.0, 50.0], [50.0, 80.0], [50.0, 100.0], [53.0, 124.0]
    ]
  },
  {
    name: "Europe",
    label: "EUROPE",
    centroid: { lat: 48.0, lon: 15.0 },
    points: [
      [36.0, -9.0], [43.0, -9.0], [46.0, -2.0], [48.0, -4.5], [50.0, 2.0], 
      [54.0, 8.0], [55.0, 12.0], [54.0, 15.0], [47.0, 15.0], [45.0, 20.0], 
      [38.0, 23.0], [37.0, 15.0], [41.0, 12.0], [43.0, 10.0], [40.0, 9.0], 
      [37.0, 9.0], [36.0, -9.0]
    ]
  },
  {
    name: "UK",
    label: "UK",
    centroid: { lat: 54.0, lon: -2.0 },
    points: [
      [50.0, -5.0], [52.0, -10.0], [55.0, -8.0], [58.0, -6.0], [60.0, -2.0], 
      [56.0, -2.0], [53.0, 0.0], [51.0, 1.5], [50.0, -5.0]
    ]
  },
  {
    name: "Japan",
    label: "JAPAN",
    centroid: { lat: 36.0, lon: 138.0 },
    points: [
      [31.0, 130.0], [32.0, 131.0], [34.0, 134.0], [36.0, 138.0], [40.0, 141.0], 
      [43.0, 140.0], [45.0, 142.0], [43.0, 145.0], [39.0, 142.0], [35.0, 139.0], 
      [33.0, 136.0], [31.0, 130.0]
    ]
  },
  {
    name: "Saudi Arabia",
    label: "SAUDI ARABIA",
    centroid: { lat: 24.0, lon: 45.0 },
    points: [
      [16.0, 42.0], [20.0, 39.0], [25.0, 37.0], [29.0, 35.0], [32.0, 39.0], 
      [31.0, 48.0], [27.0, 50.0], [25.0, 60.0], [20.0, 58.0], [17.0, 54.0], 
      [12.0, 44.0], [16.0, 42.0]
    ]
  },
  {
    name: "South Africa",
    label: "SOUTH AFRICA",
    centroid: { lat: -29.0, lon: 24.0 },
    points: [
      [-34.0, 18.0], [-30.0, 17.0], [-25.0, 20.0], [-22.0, 29.0], [-26.0, 32.0], 
      [-33.0, 27.0], [-34.0, 18.0]
    ]
  },
  {
    name: "North Africa",
    label: "NORTH AFRICA",
    centroid: { lat: 23.0, lon: 10.0 },
    points: [
      [15.0, -16.0], [21.0, -17.0], [25.0, -14.0], [32.0, -9.0], [36.0, 5.0], 
      [37.0, 11.0], [32.0, 20.0], [31.0, 27.0], [30.0, 32.0], [22.0, 31.0], 
      [15.0, 32.0], [15.0, 15.0], [15.0, -16.0]
    ]
  },
  {
    name: "Greenland",
    label: "GREENLAND",
    centroid: { lat: 72.0, lon: -40.0 },
    points: [
      [60.0, -45.0], [70.0, -60.0], [80.0, -70.0], [83.0, -40.0], [75.0, -20.0], 
      [65.0, -35.0], [60.0, -45.0]
    ]
  },
  {
    name: "Mexico",
    label: "MEXICO",
    centroid: { lat: 23.0, lon: -102.0 },
    points: [
      [25.0, -97.0], [22.0, -105.0], [16.0, -95.0], [15.0, -90.0], [13.0, -87.0], 
      [15.0, -83.0], [20.0, -87.0], [22.0, -97.0], [25.0, -97.0]
    ]
  },
  {
    name: "Argentina",
    label: "ARGENTINA",
    centroid: { lat: -38.0, lon: -65.0 },
    points: [
      [-30.0, -57.0], [-33.0, -53.0], [-38.0, -57.0], [-42.0, -62.0], [-48.0, -65.0], 
      [-55.0, -66.0], [-54.0, -72.0], [-46.0, -75.0], [-40.0, -72.0], [-35.0, -70.0], 
      [-30.0, -57.0]
    ]
  }
];

// Hub definitions with coordinates (Lat/Lon)
const hubs = [
  { name: "Bengaluru HQ", lat: 12.9716, lon: 77.5946, isHQ: true },
  { name: "New York Node", lat: 40.7128, lon: -74.0060, isHQ: false },
  { name: "London Node", lat: 51.5074, lon: -0.1278, isHQ: false },
  { name: "Tokyo Node", lat: 35.6762, lon: 139.6503, isHQ: false },
  { name: "Mumbai Terminal", lat: 19.0760, lon: 72.8777, isHQ: false }
];

// Convert Lat/Lon coordinates to 3D Cartesian
function latLonToCartesian(lat, lon) {
  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;
  return {
    x: Math.cos(latRad) * Math.cos(lonRad),
    y: Math.sin(latRad),
    z: Math.cos(latRad) * Math.sin(lonRad)
  };
}

// 3D Vector Rotations
function rotateY(x, y, z, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x * cos - z * sin,
    y: y,
    z: x * sin + z * cos
  };
}

function rotateX(x, y, z, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: x,
    y: y * cos - z * sin,
    z: y * sin + z * cos
  };
}

// Spherical Linear Interpolation (Slerp) for shipping lanes
function slerp(p1, p2, t) {
  const dot = p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
  const omega = Math.acos(Math.max(-1, Math.min(1, dot)));
  if (Math.abs(omega) < 0.001) {
    return {
      x: p1.x * (1 - t) + p2.x * t,
      y: p1.y * (1 - t) + p2.y * t,
      z: p1.z * (1 - t) + p2.z * t
    };
  }
  const sinOmega = Math.sin(omega);
  const scale1 = Math.sin((1 - t) * omega) / sinOmega;
  const scale2 = Math.sin(t * omega) / sinOmega;
  return {
    x: p1.x * scale1 + p2.x * scale2,
    y: p1.y * scale1 + p2.y * scale2,
    z: p1.z * scale1 + p2.z * scale2
  };
}

export default function InteractiveGlobe() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Rotation states (radians)
  const rotationY = useRef(0.8);
  const rotationX = useRef(0.25);
  
  // Dragging states
  const isDragging = useRef(false);
  const startMouseX = useRef(0);
  const startMouseY = useRef(0);
  const startRotationY = useRef(0);
  const startRotationX = useRef(0);

  // Hover displacement offset for interactive wiggle
  const hoverOffsetTargetX = useRef(0);
  const hoverOffsetTargetY = useRef(0);
  const hoverOffsetX = useRef(0);
  const hoverOffsetY = useRef(0);

  // Animation frame count
  const frameCount = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Convert country database boundary points to 3D Cartesian coordinates
    const countriesCartesian = countriesData.map(country => {
      const cartesianPoints = country.points.map(pt => latLonToCartesian(pt[0], pt[1]));
      const centroidCartesian = latLonToCartesian(country.centroid.lat, country.centroid.lon);
      return {
        ...country,
        cartesianPoints,
        centroidCartesian
      };
    });

    // Convert hubs coordinates to 3D Cartesian coordinates
    const hubPoints = hubs.map(h => {
      return {
        ...h,
        ...latLonToCartesian(h.lat, h.lon)
      };
    });

    const hqHub = hubPoints.find(h => h.isHQ);
    const destHubs = hubPoints.filter(h => !h.isHQ);

    let animationId;

    // Resize handler to support responsive canvas scale
    function resizeCanvas() {
      const rect = containerRef.current?.getBoundingClientRect();
      const width = rect?.width || 450;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = width * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${width}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Main Render Loop
    function render() {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const radius = width * 0.38;
      
      frameCount.current += 1;
      ctx.clearRect(0, 0, width, height);

      // Auto rotation logic when not dragging
      if (!isDragging.current) {
        rotationY.current += 0.0025;
        // Smoothly return X tilt to defaults
        rotationX.current += (0.25 - rotationX.current) * 0.03;
      }

      // Smoothly interpolate hover displacement offsets
      hoverOffsetX.current += (hoverOffsetTargetX.current - hoverOffsetX.current) * 0.1;
      hoverOffsetY.current += (hoverOffsetTargetY.current - hoverOffsetY.current) * 0.1;

      const finalRotY = rotationY.current + hoverOffsetX.current;
      const finalRotX = rotationX.current + hoverOffsetY.current;

      // 1. Draw glowing background halo (atmospheric glow)
      const glowGrad = ctx.createRadialGradient(
        width / 2, height / 2, radius * 0.8,
        width / 2, height / 2, radius * 1.3
      );
      glowGrad.addColorStop(0, "rgba(0, 180, 216, 0.1)");
      glowGrad.addColorStop(0.5, "rgba(0, 71, 204, 0.04)");
      glowGrad.addColorStop(1, "rgba(0, 71, 204, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Project function (Translates rotated 3D point to 2D canvas coordinates)
      function project(p) {
        // Step 1: Rotate Y (Yaw)
        let r = rotateY(p.x, p.y, p.z, finalRotY);
        // Step 2: Rotate X (Pitch)
        r = rotateX(r.x, r.y, r.z, finalRotX);

        // Perspective factor
        const distance = 2.3;
        const perspective = distance / (distance + r.z);

        return {
          x: width / 2 + r.x * radius * perspective,
          y: height / 2 - r.y * radius * perspective,
          z: r.z, // Keep depth coordinate
          perspective
        };
      }

      // 2. Draw Globe Glass Ocean Background Sphere
      ctx.fillStyle = "rgba(240, 244, 255, 0.35)"; // Soft semi-transparent ocean
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw subtle globe outline
      ctx.strokeStyle = "rgba(0, 71, 204, 0.08)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3. Draw Latitude & Longitude grid lines (inside ocean)
      ctx.lineWidth = 0.5;
      
      // Draw grid lines: Latitudes at -60, -30, 0, 30, 60
      [-60, -30, 0, 30, 60].forEach((latVal) => {
        ctx.beginPath();
        const latRad = (latVal * Math.PI) / 180;
        const cosLat = Math.cos(latRad);
        const sinLat = Math.sin(latRad);
        let first = true;

        for (let l = 0; l <= 360; l += 5) {
          const lonRad = (l * Math.PI) / 180;
          const px = cosLat * Math.cos(lonRad);
          const py = sinLat;
          const pz = cosLat * Math.sin(lonRad);

          const proj = project({ x: px, y: py, z: pz });
          
          if (proj.z >= 0) {
            ctx.strokeStyle = "rgba(0, 71, 204, 0.05)";
          } else {
            ctx.strokeStyle = "rgba(0, 71, 204, 0.015)";
          }

          if (first) {
            ctx.moveTo(proj.x, proj.y);
            first = false;
          } else {
            ctx.lineTo(proj.x, proj.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(proj.x, proj.y);
          }
        }
      });

      // Draw grid lines: Longitudes at -120, -60, 0, 60, 120, 180
      [-120, -60, 0, 60, 120, 180].forEach((lonVal) => {
        ctx.beginPath();
        const lonRad = (lonVal * Math.PI) / 180;
        let first = true;

        for (let latVal = -90; latVal <= 90; latVal += 5) {
          const latRad = (latVal * Math.PI) / 180;
          const px = Math.cos(latRad) * Math.cos(lonRad);
          const py = Math.sin(latRad);
          const pz = Math.cos(latRad) * Math.sin(lonRad);

          const proj = project({ x: px, y: py, z: pz });
          
          if (proj.z >= 0) {
            ctx.strokeStyle = "rgba(0, 71, 204, 0.04)";
          } else {
            ctx.strokeStyle = "rgba(0, 71, 204, 0.015)";
          }

          if (first) {
            ctx.moveTo(proj.x, proj.y);
            first = false;
          } else {
            ctx.lineTo(proj.x, proj.y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(proj.x, proj.y);
          }
        }
      });

      // 4. Draw Country Polygons & Labels with Horizon Clipping (prevents line-stretching artifacts)
      countriesCartesian.forEach((country) => {
        const isHQCountry = country.name === "India";
        
        // 3D rotations for all country vertices
        const rotatedPoints = country.cartesianPoints.map(p => {
          let r = rotateY(p.x, p.y, p.z, finalRotY);
          r = rotateX(r.x, r.y, r.z, finalRotX);
          return r;
        });

        // Horizon Culling: If ALL vertices are deep on the back hemisphere, skip rendering
        const hasVisibleVertex = rotatedPoints.some(r => r.z <= 0.05);
        if (!hasVisibleVertex) return;

        // Vector Horizon Clipping Algorithm:
        // Pull back-facing vertices to the silhouette horizon edge (z = 0)
        // to prevent them from stretching across the front viewport when connected.
        const clippedRotatedPoints = rotatedPoints.map(r => {
          if (r.z > 0.02) {
            const len = Math.sqrt(r.x * r.x + r.y * r.y);
            if (len === 0) return { x: 0, y: 0, z: 0 };
            return {
              x: r.x / len,
              y: r.y / len,
              z: 0.02
            };
          }
          return r;
        });

        // Project clipped 3D points to 2D screen coordinates
        const projectedPoints = clippedRotatedPoints.map(r => {
          const distance = 2.3;
          const perspective = distance / (distance + r.z);
          return {
            x: width / 2 + r.x * radius * perspective,
            y: height / 2 - r.y * radius * perspective,
            z: r.z
          };
        });

        // Rotate Centroid to check front-face visibility for labels
        const centroidRotY = rotateY(country.centroidCartesian.x, country.centroidCartesian.y, country.centroidCartesian.z, finalRotY);
        const centroidRot = rotateX(centroidRotY.x, centroidRotY.y, centroidRotY.z, finalRotX);
        const centroidProj = project(country.centroidCartesian);

        // Draw Country Outline and Fill
        ctx.beginPath();
        projectedPoints.forEach((projPt, idx) => {
          if (idx === 0) {
            ctx.moveTo(projPt.x, projPt.y);
          } else {
            ctx.lineTo(projPt.x, projPt.y);
          }
        });
        ctx.closePath();

        // Calculate opacity based on depth to fade countries gracefully at the horizon
        const fadeValue = Math.max(0, 1.0 - Math.abs(centroidRot.z));
        
        // Fill country (glassmorphic blue)
        const fillOpacity = Math.max(0.01, (isHQCountry ? 0.22 : 0.13) * fadeValue);
        ctx.fillStyle = isHQCountry ? `rgba(0, 71, 204, ${fillOpacity})` : `rgba(0, 114, 204, ${fillOpacity})`;
        ctx.fill();

        // Stroke country boundary
        const borderOpacity = Math.max(0.02, 0.45 * fadeValue);
        ctx.strokeStyle = isHQCountry ? `rgba(0, 71, 204, ${borderOpacity})` : `rgba(0, 180, 216, ${borderOpacity})`;
        ctx.lineWidth = isHQCountry ? 1.5 : 1.0;
        ctx.stroke();

        // Draw 3D Country Name Label (Only if centroid is in the front viewport hemisphere)
        if (centroidRot.z <= 0) {
          const distToCenter = Math.sqrt(centroidRot.x * centroidRot.x + centroidRot.y * centroidRot.y);
          // Fade label out as it moves towards the silhouette profile
          const labelOpacity = Math.max(0, (1 - distToCenter) * 0.8);
          
          if (labelOpacity > 0.05) {
            ctx.fillStyle = isHQCountry ? `rgba(0, 71, 204, ${labelOpacity})` : `rgba(71, 85, 105, ${labelOpacity})`;
            ctx.font = `bold ${isHQCountry ? "10px" : "8px"} Space Grotesk`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(country.label, centroidProj.x, centroidProj.y);
          }
        }
      });

      // 5. Draw shipping arcs connecting Bengaluru HQ to other nodes

      destHubs.forEach((dest, idx) => {
        
        // Generate shipping arc segment points
        ctx.beginPath();
        let pathPoints = [];
        const segments = 30;
        
        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          // Interpolate point along great circle path
          const p = slerp(hqHub, dest, t);
          // Rise above surface slightly in the center to create a 3D arc flight path
          const heightArc = 0.09 * Math.sin(Math.PI * t);
          const elevatedP = {
            x: p.x * (1 + heightArc),
            y: p.y * (1 + heightArc),
            z: p.z * (1 + heightArc)
          };
          
          pathPoints.push(project(elevatedP));
        }

        // Draw arc path segments with depth-aware opacity
        for (let i = 1; i < pathPoints.length; i++) {
          const pStart = pathPoints[i - 1];
          const pEnd = pathPoints[i];

          const avgZ = (pStart.z + pEnd.z) / 2;
          if (avgZ > 0.1) {
            ctx.strokeStyle = "rgba(0, 180, 216, 0.03)";
          } else {
            ctx.strokeStyle = "rgba(0, 180, 216, 0.35)";
          }
          
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(pStart.x, pStart.y);
          ctx.lineTo(pEnd.x, pEnd.y);
          ctx.stroke();
        }

        // Draw flowing packet animation on front arcs
        const packetT = ((frameCount.current * 0.0035) + idx * 0.25) % 1.0;
        const packetPosVec = slerp(hqHub, dest, packetT);
        const packetHeight = 0.09 * Math.sin(Math.PI * packetT);
        const packetElevated = {
          x: packetPosVec.x * (1 + packetHeight),
          y: packetPosVec.y * (1 + packetHeight),
          z: packetPosVec.z * (1 + packetHeight)
        };
        const packetProj = project(packetElevated);

        // Only draw packet if in the front hemisphere
        if (packetProj.z <= 0.05) {
          ctx.fillStyle = "#00d4ff";
          ctx.beginPath();
          ctx.arc(packetProj.x, packetProj.y, 2.5 * packetProj.perspective, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.strokeStyle = "rgba(0, 212, 255, 0.5)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(packetProj.x, packetProj.y, 5 * packetProj.perspective, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // 6. Draw Hub Markers & Labels (rendered on top of polygons)
      hubPoints.forEach((hub) => {
        const proj = project(hub);

        // Draw hub markers on the visible front face
        if (proj.z <= 0.1) {
          const isHQ = hub.isHQ;
          
          // Base dot
          ctx.fillStyle = isHQ ? "#0047cc" : "#00b4d8";
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, (isHQ ? 4.5 : 3.5) * proj.perspective, 0, Math.PI * 2);
          ctx.fill();

          // Pulsing radar ring
          const pulsePeriod = isHQ ? 40 : 50;
          const pulseVal = (frameCount.current % pulsePeriod) / pulsePeriod;
          const ringRad = ((isHQ ? 5 : 4) + pulseVal * 14) * proj.perspective;
          const ringAlpha = Math.max(0, 0.85 - pulseVal);

          ctx.strokeStyle = isHQ ? `rgba(0, 71, 204, ${ringAlpha})` : `rgba(0, 180, 216, ${ringAlpha})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, ringRad, 0, Math.PI * 2);
          ctx.stroke();

          // Hub labels (with drop shadows for peak legibility)
          ctx.fillStyle = "#0a1628";
          ctx.font = `bold ${isHQ ? "10px" : "9px"} Space Grotesk`;
          ctx.textAlign = "left";
          ctx.textBaseline = "middle";
          
          const labelText = hub.name;
          const labelX = proj.x + 8 * proj.perspective;
          const labelY = proj.y;
          
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.fillText(labelText, labelX + 1, labelY + 1);
          ctx.fillStyle = "#0a1628";
          ctx.fillText(labelText, labelX, labelY);

          if (isHQ) {
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
            ctx.font = "800 7px Plus Jakarta Sans";
            ctx.fillText("HQ NODE / BLR", labelX + 1, labelY + 9);
            ctx.fillStyle = "rgba(0, 71, 204, 0.85)";
            ctx.fillText("HQ NODE / BLR", labelX, labelY + 8);
          }
        }
      });

      animationId = requestAnimationFrame(render);
    }

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Event Handlers for click-and-drag rotation
  const handleMouseDown = (e) => {
    isDragging.current = true;
    startMouseX.current = e.clientX;
    startMouseY.current = e.clientY;
    startRotationY.current = rotationY.current;
    startRotationX.current = rotationX.current;
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const xCoord = e.clientX - rect.left - rect.width / 2;
    const yCoord = e.clientY - rect.top - rect.height / 2;

    if (isDragging.current) {
      const deltaX = e.clientX - startMouseX.current;
      const deltaY = e.clientY - startMouseY.current;

      rotationY.current = startRotationY.current + deltaX * 0.0075;
      rotationX.current = Math.max(-1.4, Math.min(1.4, startRotationX.current - deltaY * 0.0075));
    } else {
      // Hover parallax displacement target values
      hoverOffsetTargetX.current = (xCoord / rect.width) * 0.15;
      hoverOffsetTargetY.current = -(yCoord / rect.height) * 0.15;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    isDragging.current = false;
    setIsHovered(false);
    hoverOffsetTargetX.current = 0;
    hoverOffsetTargetY.current = 0;
  };

  // Touch support for mobile users
  const handleTouchStart = (e) => {
    if (e.touches.length !== 1) return;
    isDragging.current = true;
    startMouseX.current = e.touches[0].clientX;
    startMouseY.current = e.touches[0].clientY;
    startRotationY.current = rotationY.current;
    startRotationX.current = rotationX.current;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startMouseX.current;
    const deltaY = e.touches[0].clientY - startMouseY.current;

    rotationY.current = startRotationY.current + deltaX * 0.008;
    rotationX.current = Math.max(-1.4, Math.min(1.4, startRotationX.current - deltaY * 0.008));
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full flex items-center justify-center relative select-none"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`cursor-grab active:cursor-grabbing transition-opacity duration-500 max-w-[450px] max-h-[450px] ${
          isHovered ? "opacity-100" : "opacity-95"
        }`}
      />
      <div className="absolute bottom-2 text-[9px] font-bold tracking-wider text-slate-400 font-display uppercase pointer-events-none opacity-60 flex items-center gap-1">
        <span>Click & drag to rotate globe</span>
      </div>
    </div>
  );
}
