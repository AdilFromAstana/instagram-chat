export const formatTime = (createdAt) => {
  const date = new Date(createdAt);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isYesterday =
    date.getDate() === now.getDate() - 1 &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isCurrentYear = date.getFullYear() === now.getFullYear();

  if (isToday) {
    // Если дата - сегодня, вернуть только время
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else if (isYesterday) {
    // Если дата - вчера, вернуть "Вчера" и время
    return `Вчера, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else {
    // Если дата не сегодня и не вчера
    return (
      date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        ...(isCurrentYear ? {} : { year: "numeric" }), // Добавить год, если он не текущий
      }) +
      `, ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
  }
};
