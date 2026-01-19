export const botaoEstilos = {
  base: "px-6 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg font-medium",

  variants: {
    primary: "",
    update: "bg-blue-500 text-white hover:bg-blue-600",
    gray: "bg-gray-400 text-white hover:bg-gray-500",
    success: "bg-green-600 text-white hover:bg-green-700",
    delete: "bg-red-500 text-white hover:bg-red-600",
    next: "bg-purple-500 text-white hover:bg-purple-600 ml-auto",
    gradient: "bg-gradient-to-r from-purple-400 via-blue-300 to-purple-400 rounded-full shadow-md hover:shadow-lg transition-all text-lg font-semibold px-6 py-2",
  },

  sizes: {
    sm: "text-sm px-3 py-1",
    md: "text-base px-6 py-2",
    lg: "text-lg px-8 py-3",
  },
} as const;
