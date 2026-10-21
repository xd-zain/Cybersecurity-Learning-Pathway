'use client'

import React from 'react'
import { SplineScene } from "./splite";
import { Card } from "./card"
import { Spotlight } from "./spotlight"
import { Shield, Sparkles, Orbit, Terminal, Cpu } from "lucide-react"

interface SplineRobotCardProps {
  onInteract?: () => void;
  className?: string;
}

export function SplineSceneBasic({ onInteract, className }: SplineRobotCardProps) {
  return (
    <Card className={`w-full min-h-[520px] lg:h-[580px] bg-[#141413] border border-[rgba(241,239,234,0.12)] relative overflow-hidden group shadow-2xl ${className || ''}`}>
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        size={400}
      />
      
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left content */}
        <div className="flex-1 p-8 sm:p-12 relative z-10 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1c1b] border border-[rgba(241,239,234,0.15)] text-[#F1EFEA] text-xs font-mono mb-4 w-fit">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Interactive 3D Autonomous Agent</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-[#F1EFEA] leading-tight">
            Autonomous <span className="font-serif italic font-normal text-[#F1EFEA]">Cyber Guardian</span>
          </h2>
          
          <p className="mt-4 text-sm sm:text-base text-[#98968f] max-w-lg leading-relaxed">
            Experience real-time interactive 3D telemetry. Rotate, zoom, and inspect the autonomous defense sentinel powered by zero-trust neural heuristics and Google Gemini intelligence.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-mono text-[#98968f]">
            <div className="flex items-center gap-2 bg-[#1c1c1b] px-3 py-2 rounded-lg border border-[rgba(241,239,234,0.08)]">
              <Cpu className="w-4 h-4 text-[#F1EFEA]" />
              <span>Real-Time 3D Mesh</span>
            </div>
            <div className="flex items-center gap-2 bg-[#1c1c1b] px-3 py-2 rounded-lg border border-[rgba(241,239,234,0.08)]">
              <Shield className="w-4 h-4 text-[#F1EFEA]" />
              <span>Mouse / Touch Responsive</span>
            </div>
          </div>
        </div>

        {/* Right content: 3D Robot Spline Scene */}
        <div className="flex-1 relative min-h-[380px] lg:min-h-full w-full flex items-center justify-center">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
          <div className="absolute bottom-4 right-4 pointer-events-none text-[11px] font-mono text-[#98968f]/60 bg-[#111110]/80 px-2.5 py-1 rounded border border-[rgba(241,239,234,0.06)] backdrop-blur">
            Drag to rotate 3D robot · Scroll to zoom
          </div>
        </div>
      </div>
    </Card>
  )
}

export default SplineSceneBasic;
