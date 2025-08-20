"use client"

import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { DivideIcon as LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const location = useLocation()
  const [activeTab, setActiveTab] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Update active tab based on current route
  useEffect(() => {
    const currentItem = items.find(item => {
      if (item.url === '/') {
        return location.pathname === '/'
      }
      return location.pathname.startsWith(item.url)
    })
    
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [location.pathname, items])
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-6 sm:pt-6",
        className,
      )}
    >
      <div className="flex items-center gap-6 bg-creamy-white/90 border border-light-sand backdrop-blur-lg py-2 px-3 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <Link
              key={item.name}
              to={item.url}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-charcoal-black/80 hover:text-deep-orange px-8 py-3",
                isActive && "bg-light-sand text-deep-orange",
              )}
            >
              <span className="hidden md:inline text-base font-medium">{item.name}</span>
              <span className="md:hidden">
                <Icon size={20} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-deep-orange/10 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-deep-orange rounded-t-full">
                    <div className="absolute w-16 h-8 bg-deep-orange/20 rounded-full blur-md -top-3 -left-3" />
                    <div className="absolute w-12 h-8 bg-deep-orange/20 rounded-full blur-md -top-2" />
                    <div className="absolute w-6 h-6 bg-deep-orange/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}