"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text as DreiText, RoundedBox } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import { motion } from "motion/react";
import type {
  ContentDefinition,
  FormType,
  RuntimeOverride,
  StyleTemplate,
} from "@/lib/pbmp/types";
import { resolveStyle } from "@/lib/pbmp/style-resolver";

interface Chart3DProps {
  formType: FormType;
  content: ContentDefinition;
  template: StyleTemplate;
  runtime: RuntimeOverride;
  title: string;
  onHoverEnter: () => void;
  onHoverExit: () => void;
  onClick: () => void;
}

function Bars({
  content,
  colour,
  depth,
  highlightIndex,
  highlightColour,
}: {
  content: ContentDefinition;
  colour: string;
  depth: number;
  highlightIndex: number | null;
  highlightColour: string;
}) {
  const max = Math.max(...content.data.map((d) => d.value));
  return (
    <group position={[-(content.data.length - 1) * 0.7, 0, 0]}>
      {content.data.map((d, i) => {
        const h = (d.value / max) * 2.4 + 0.15;
        const isHi = highlightIndex === i;
        return (
          <group key={d.category} position={[i * 1.4, h / 2, 0]}>
            <RoundedBox
              args={[0.7, h, depth]}
              radius={0.08}
              smoothness={4}
              castShadow
              receiveShadow
            >
              <meshStandardMaterial
                color={isHi ? highlightColour : colour}
                roughness={0.4}
                metalness={0.15}
                emissive={isHi ? highlightColour : "#000000"}
                emissiveIntensity={isHi ? 0.25 : 0}
              />
            </RoundedBox>
            <DreiText
              position={[0, -h / 2 - 0.28, 0]}
              fontSize={0.18}
              color="#94A3B8"
              anchorX="center"
              anchorY="top"
            >
              {d.category.slice(0, 3)}
            </DreiText>
          </group>
        );
      })}
    </group>
  );
}

function LinePath({
  content,
  colour,
}: {
  content: ContentDefinition;
  colour: string;
}) {
  const max = Math.max(...content.data.map((d) => d.value));
  const points = useMemo(() => {
    return content.data.map((d, i) => {
      const x = (i - (content.data.length - 1) / 2) * 1.4;
      const y = (d.value / max) * 2.4;
      return [x, y, 0] as [number, number, number];
    });
  }, [content, max]);

  return (
    <group>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={colour} emissive={colour} emissiveIntensity={0.2} />
        </mesh>
      ))}
      {points.slice(0, -1).map((p, i) => {
        const n = points[i + 1];
        const mid: [number, number, number] = [
          (p[0] + n[0]) / 2,
          (p[1] + n[1]) / 2,
          0,
        ];
        const dx = n[0] - p[0];
        const dy = n[1] - p[1];
        const len = Math.sqrt(dx * dx + dy * dy);
        const angle = Math.atan2(dy, dx);
        return (
          <mesh key={`seg-${i}`} position={mid} rotation={[0, 0, angle]}>
            <boxGeometry args={[len, 0.05, 0.05]} />
            <meshStandardMaterial color={colour} />
          </mesh>
        );
      })}
    </group>
  );
}

export function Chart3D({
  formType,
  content,
  template,
  runtime,
  title,
  onHoverEnter,
  onHoverExit,
  onClick,
}: Chart3DProps) {
  const style = resolveStyle(template, formType, "3d", runtime);
  const isLine = formType === "lineChart";

  return (
    <motion.div
      animate={{
        scale: style.pulsing ? [1, 1.03, 1] : style.scale,
        opacity: style.opacity,
      }}
      transition={
        style.pulsing
          ? { duration: 0.7, repeat: 1 }
          : { duration: 0.45, ease: "easeOut" }
      }
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverExit}
      onClick={onClick}
      className="relative cursor-pointer overflow-hidden"
      style={{
        background: style.sceneBackground,
        borderRadius: style.borderRadius,
        border:
          style.border === "transparent" || !style.border
            ? "1px solid rgba(255,255,255,0.06)"
            : `1px solid ${style.border}`,
        padding: 16,
        minHeight: 340,
      }}
    >
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h3
            style={{
              color: style.contentPrimary,
              fontFamily: style.fontFamily,
              fontSize: style.titleSize,
              fontWeight: style.titleWeight,
            }}
          >
            {title}
          </h3>
          <p className="mt-0.5 text-xs" style={{ color: style.contentSecondary }}>
            3D Form · same Style Template tokens
          </p>
        </div>
        <span
          className="rounded px-2 py-0.5 text-[10px] font-semibold"
          style={{ background: style.elevated, color: style.contentSecondary }}
        >
          3D
        </span>
      </div>
      <div className="h-[280px] w-full">
        <Canvas shadows camera={{ position: [4.5, 3.2, 5.5], fov: 42 }}>
          <color attach="background" args={[style.sceneBackground]} />
          <ambientLight intensity={0.55 * style.lightIntensity} />
          <directionalLight
            castShadow
            position={[5, 8, 4]}
            intensity={style.lightIntensity}
            shadow-mapSize={[1024, 1024]}
          />
          <Suspense fallback={null}>
            {style.floorGrid && (
              <gridHelper args={[10, 10, style.grid, style.grid]} position={[0, 0, 0]} />
            )}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <meshStandardMaterial color={style.elevated} roughness={0.9} />
            </mesh>
            {isLine ? (
              <LinePath content={content} colour={style.materialColour} />
            ) : (
              <Bars
                content={content}
                colour={style.materialColour}
                depth={style.barDepth}
                highlightIndex={runtime.highlightedIndex ?? null}
                highlightColour={style.statusColour ?? style.selectedOutline}
              />
            )}
          </Suspense>
          <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} />
        </Canvas>
      </div>
      {style.tooltipVisible && (
        <div
          className="pointer-events-none absolute bottom-4 right-4 max-w-[220px] rounded-md px-3 py-2 text-xs"
          style={{
            background: style.tooltip,
            color: style.contentPrimary,
          }}
        >
          {style.tooltipContent}
        </div>
      )}
    </motion.div>
  );
}
