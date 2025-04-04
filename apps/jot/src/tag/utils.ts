import tailwindColors from "tailwindcss/colors"

type TailwindColor = keyof typeof tailwindColors

export const isGradiableColor = (color: TailwindColor) => {
   const excludedColors = [
      "black",
      "white",
      "transparent",
      "current",
      "inherit",
   ]
   return (
      !excludedColors.includes(color) &&
      tailwindColors[color]?.[50] &&
      tailwindColors[color]?.[100]
   )
}

export const tagGradient = (str: string) => {
   const availableColors = Object.keys(tailwindColors).filter(
      isGradiableColor as never,
   )

   let hash = 0
   for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
   }

   const color = availableColors[Math.abs(hash) % availableColors.length] as
      | TailwindColor
      | undefined
   if (!color) return []
   return [tailwindColors[color][50], tailwindColors[color][100]] as const
}
