import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import React, { useCallback, useMemo } from "react";

const Beam = ({ width, x, delay, duration }) => {
    const hue = Math.floor(Math.random() * 360);
    const ar = Math.floor(Math.random() * 10) + 1;

    return (
        <motion.div
            style={{
                position: 'absolute',
                left: x,
                top: 0,
                width: width,
                aspectRatio: `1/${ar}`,
                background: `linear-gradient(hsl(${hue} 80% 60%), transparent)`,
            }}
            initial={{ y: "100%", x: "-50%" }}
            animate={{ y: "-100%", x: "-50%" }}
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "linear",
            }}
        />
    );
};

export const WarpBackground = ({
    children,
    perspective = 100,
    className,
    beamsPerSide = 3,
    beamSize = 5,
    beamDelayMax = 3,
    beamDelayMin = 0,
    beamDuration = 3,
    gridColor = "rgba(0, 0, 0, 0.15)",
    ...props
}) => {
    const generateBeams = useCallback(() => {
        const beams = [];
        const cellsPerSide = Math.floor(100 / beamSize);
        const step = cellsPerSide / beamsPerSide;

        for (let i = 0; i < beamsPerSide; i++) {
            const x = Math.floor(i * step);
            const delay =
                Math.random() * (beamDelayMax - beamDelayMin) + beamDelayMin;
            beams.push({ x: `${x * beamSize}%`, delay });
        }
        return beams;
    }, [beamsPerSide, beamSize, beamDelayMax, beamDelayMin]);

    const topBeams = useMemo(() => generateBeams(), [generateBeams]);
    const rightBeams = useMemo(() => generateBeams(), [generateBeams]);
    const bottomBeams = useMemo(() => generateBeams(), [generateBeams]);
    const leftBeams = useMemo(() => generateBeams(), [generateBeams]);

    const gridStyle = {
        backgroundSize: `${beamSize}% ${beamSize}%`,
        backgroundImage: `
      linear-gradient(${gridColor} 1px, transparent 1px),
      linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
    `,
    };

    return (
        <div className={cn("relative", className)} style={{ minHeight: '100vh' }} {...props}>
            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    perspective: `${perspective}px`,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                }}
            >
                {/* top side */}
                <div
                    style={{
                        ...gridStyle,
                        position: 'absolute',
                        width: '100%',
                        height: '100vh',
                        transformOrigin: '50% 0%',
                        transform: 'rotateX(-90deg)',
                    }}
                >
                    {topBeams.map((beam, index) => (
                        <Beam
                            key={`top-${index}`}
                            width={`${beamSize}%`}
                            x={beam.x}
                            delay={beam.delay}
                            duration={beamDuration}
                        />
                    ))}
                </div>
                {/* bottom side */}
                <div
                    style={{
                        ...gridStyle,
                        position: 'absolute',
                        width: '100%',
                        height: '100vh',
                        top: '100%',
                        transformOrigin: '50% 0%',
                        transform: 'rotateX(-90deg)',
                    }}
                >
                    {bottomBeams.map((beam, index) => (
                        <Beam
                            key={`bottom-${index}`}
                            width={`${beamSize}%`}
                            x={beam.x}
                            delay={beam.delay}
                            duration={beamDuration}
                        />
                    ))}
                </div>
                {/* left side */}
                <div
                    style={{
                        ...gridStyle,
                        position: 'absolute',
                        width: '100vh',
                        height: '100vh',
                        left: 0,
                        top: 0,
                        transformOrigin: '0% 0%',
                        transform: 'rotate(90deg) rotateX(-90deg)',
                    }}
                >
                    {leftBeams.map((beam, index) => (
                        <Beam
                            key={`left-${index}`}
                            width={`${beamSize}%`}
                            x={beam.x}
                            delay={beam.delay}
                            duration={beamDuration}
                        />
                    ))}
                </div>
                {/* right side */}
                <div
                    style={{
                        ...gridStyle,
                        position: 'absolute',
                        width: '100vh',
                        height: '100vh',
                        right: 0,
                        top: 0,
                        transformOrigin: '100% 0%',
                        transform: 'rotate(-90deg) rotateX(-90deg)',
                    }}
                >
                    {rightBeams.map((beam, index) => (
                        <Beam
                            key={`right-${index}`}
                            width={`${beamSize}%`}
                            x={beam.x}
                            delay={beam.delay}
                            duration={beamDuration}
                        />
                    ))}
                </div>
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
        </div>
    );
};
