"use client"

import React, { useState } from "react"
import { cn } from "../../lib/utils"

const Dock = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div className="flex items-end justify-center gap-2 p-4">
      {items.map((item, index) => {
        const Icon = item.icon
        const isHovered = hoveredIndex === index
        
        return (
          <div
            key={index}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <button
              onClick={item.onClick}
              className={cn(
                "w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 hover:bg-white/20 hover:scale-110",
                isHovered && "bg-white/20 scale-110"
              )}
            >
              <Icon className="w-6 h-6 text-white" />
            </button>
            
            {/* Tooltip */}
            {isHovered && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded whitespace-nowrap">
                {item.label}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Dock
