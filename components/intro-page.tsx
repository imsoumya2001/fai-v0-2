"use client"

import { useEffect } from "react"
import { motion, stagger, useAnimate } from "motion/react"

import Floating, {
  FloatingElement,
} from "@/components/ui/parallax-floating"

const exampleImages = [
  {
    url: "https://ik.imagekit.io/soumya3301/generation-dd8bac9c-16ed-4c1d-9e01-4224175c0081.png?updatedAt=1754109271055",
    title: "AI-Generated Furniture 1",
  },
  {
    url: "https://ik.imagekit.io/soumya3301/generation-a3caf13e-87ec-427a-8722-bcb3ed09c8a1.png?updatedAt=1754108199486",
    title: "AI-Generated Furniture 2",
  },
  {
    url: "https://ik.imagekit.io/soumya3301/32.png?updatedAt=1754108200417",
    title: "AI-Generated Furniture 3",
  },
  {
    url: "https://ik.imagekit.io/soumya3301/35.png?updatedAt=1754108200390",
    title: "AI-Generated Furniture 4",
  },
  {
    url: "https://ik.imagekit.io/soumya3301/34.png?updatedAt=1754108199897",
    title: "AI-Generated Furniture 5",
  },
  {
    url: "https://ik.imagekit.io/soumya3301/aafurniture777__2025-03-12T170024.000Z_1.jpg?updatedAt=1754109270709",
    title: "AI-Generated Furniture 6",
  },
  {
    url: "https://ik.imagekit.io/soumya3301/generation-7df655d0-c615-41ca-b0b9-61e32c44c477.png?updatedAt=1754108199270",
    title: "AI-Generated Furniture 7",
  },
  {
    url: "https://ik.imagekit.io/soumya3301/generation-a3caf13e-87ec-427a-8722-bcb3ed09c8a1.png?updatedAt=1754108199486",
    title: "AI-Generated Furniture 8",
  },
]

interface IntroPageProps {
  onEnter: () => void
}

const IntroPage = ({ onEnter }: IntroPageProps) => {
  const [scope, animate] = useAnimate()

  useEffect(() => {
    animate("img", { opacity: [0, 1] }, { duration: 0.5, delay: stagger(0.15) })
  }, [])

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
        className="z-50 text-center space-y-4 items-center flex flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
      >
        <h1 className="text-5xl md:text-7xl z-50 text-white font-playfair italic font-light">
          furnitureAI
        </h1>
        <motion.button
          onClick={handleEnterClick}
          className="text-sm z-50 hover:scale-110 transition-transform bg-white text-black rounded-full py-3 px-8 font-poppins font-medium cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter
        </motion.button>
      </motion.div>

      <Floating sensitivity={-1} className="overflow-hidden">
        <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[0].url}
            className="w-16 h-16 md:w-24 md:h-24 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[10%] left-[32%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[1].url}
            className="w-20 h-20 md:w-28 md:h-28 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[2%] left-[53%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[2].url}
            className="w-28 h-40 md:w-40 md:h-52 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[0%] left-[83%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[3].url}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[40%] left-[2%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[4].url}
            className="w-28 h-28 md:w-36 md:h-36 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[70%] left-[77%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[7].url}
            className="w-28 h-28 md:w-36 md:h-48 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>

        <FloatingElement depth={4} className="top-[73%] left-[15%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[5].url}
            className="w-40 md:w-52 h-full object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[80%] left-[50%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[6].url}
            className="w-24 h-24 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
      </Floating>
    </div>
  )
}

export { IntroPage }