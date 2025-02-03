import { createContext, useContext, useState } from "react";

// 📌 Создаём контекст
const ScrollContext = createContext();

// 📌 Провайдер контекста
export const ScrollProvider = ({ children }) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  return (
    <ScrollContext.Provider value={{ scrollPosition, setScrollPosition }}>
      {children}
    </ScrollContext.Provider>
  );
};

// 📌 Хук для удобного использования контекста
export const useScroll = () => useContext(ScrollContext);
