"use client"

import { useEffect, useState } from "react"
import { motion, stagger, useAnimate } from "motion/react"

import Floating, {
  FloatingElement,
} from "@/components/ui/parallax-floating"

// Furniture-themed images from Unsplash
const furnitureImages = [
  {
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Modern Chair",
  },
  {
    url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Minimalist Sofa",
  },
  {
    url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Living Room Setup",
  },
  {
    url: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Modern Dining Table",
  },
  {
    url: "https://images.unsplash.com/photo-1551298370-9c50eee78665?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Bedroom Interior",
  },
  {
    url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Office Setup",
  },
  {
    url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2187&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Designer Chair",
  },
  {
    url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Room Decor",
  },
]

interface IntroPageProps {
  onEnter: () => void
}

const IntroPage = ({ onEnter }: IntroPageProps) => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate("img", { opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.15) })
  }, [animate])

  const handleEnterClick = () => {
    onEnter()
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleEnterClick()
    }
  }

  return (
    <div
      className="flex w-full h-screen min-h-[600px] justify-center items-center bg-black overflow-hidden"
      ref={scope}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <motion.div
        className="z-50 text-center space-y-6 items-center flex flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
      >
        <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl z-50 text-white font-serif italic font-light tracking-wide text-center px-4">
          Furniture AI
        </h1>
        <motion.button
          onClick={handleEnterClick}
          className="text-sm sm:text-base z-50 hover:scale-110 transition-all duration-300 bg-white text-black rounded-full py-3 px-8 sm:py-4 sm:px-10 cursor-pointer font-medium tracking-wider uppercase shadow-lg hover:shadow-xl min-h-[48px] touch-manipulation"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter
        </motion.button>
        <p className="text-xs sm:text-sm text-gray-400 z-50 mt-4 text-center px-4">
          Press Enter or tap to continue
        </p>
      </motion.div>

      <Floating sensitivity={-1} className="overflow-hidden">
        <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={furnitureImages[0].url}
            alt={furnitureImages[0].title}
            className="w-16 h-16 md:w-24 md:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
        
        <FloatingElement depth={1} className="top-[10%] left-[32%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={furnitureImages[1].url}
            alt={furnitureImages[1].title}
            className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
        
        <FloatingElement depth={2} className="top-[2%] left-[53%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={furnitureImages[2].url}
            alt={furnitureImages[2].title}
            className="w-28 h-40 md:w-40 md:h-52 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
        
        <FloatingElement depth={1} className="top-[0%] left-[83%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={furnitureImages[3].url}
            alt={furnitureImages[3].title}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[40%] left-[2%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={furnitureImages[4].url}
            alt={furnitureImages[4].title}
            className="w-28 h-28 md:w-36 md:h-36 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
        
        <FloatingElement depth={2} className="top-[70%] left-[77%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={furnitureImages[7].url}
            alt={furnitureImages[7].title}
            className="w-28 h-28 md:w-36 md:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>

        <FloatingElement depth={4} className="top-[73%] left-[15%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={furnitureImages[5].url}
            alt={furnitureImages[5].title}
            className="w-40 md:w-52 h-full object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
        
        <FloatingElement depth={1} className="top-[80%] left-[50%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={furnitureImages[6].url}
            alt={furnitureImages[6].title}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform rounded-lg"
          />
        </FloatingElement>
      </Floating>
    </div>
  )
}

export { IntroPage }