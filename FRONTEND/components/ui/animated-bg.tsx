"use client"

import { useEffect, useState, useMemo } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

export default function AnimatedBg() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setReady(true))
  }, [])

  // Dark tema sabit olduğu için tek renk seti yeterli
  const colors = useMemo(
    () => ({
      dot: "#7dd3fc" /* cyan-300 */,
      link: "#86efac" /* green-300 */,
    }),
    []
  )

  if (!ready) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Particles
        id="ayzek-animated-bg"
        options={{
          fullScreen: false,
          background: { color: { value: "transparent" } },
          fpsLimit: 60,
          detectRetina: true,
          particles: {
            number: { value: 100, density: { enable: true } },
            color: { value: colors.dot },
            shape: { type: "circle" },
            opacity: { value: 0.4 },
            size: { value: { min: 1.5, max: 2.5 } },
            move: { enable: true, speed: 1.0, outModes: { default: "bounce" } },
            links: {
              enable: true,
              color: colors.link,
              distance: 160,
              opacity: 0.25,
              width: 1,
            },
          },
          interactivity: {
            detectsOn: "window",
            events: { onHover: { enable: true, mode: "repulse" }, resize: { enable: true } },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
        }}
      />
    </div>
  )
}
