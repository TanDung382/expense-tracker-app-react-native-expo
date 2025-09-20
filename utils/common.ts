export const getLast7Days = () => {
  const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]; // tiếng Việt
  const result: any[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    result.push({
      day: daysOfWeek[date.getDay()],
      date: date.toISOString().split("T")[0],
      income: 0,
      expense: 0,
    });
  }

  return result.reverse();
};

export const getLast12Months = () => {
  const result = [];

  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    // Lấy tên tháng tiếng Việt
    const monthName = date.toLocaleString("vi-VN", { month: "short" });
    const shortYear = date.getFullYear().toString().slice(-2);

    const formattedMonthYear = `${monthName} ${shortYear}`; 
    const formattedDate = date.toISOString().split("T")[0];

    result.push({
      month: formattedMonthYear, // VD: "Thg 9 25"
      fullDate: formattedDate,
      income: 0,
      expense: 0,
    });
  }

  // return result;
  return result.reverse();
};

export const getYearsRange = (startYear: number, endYear: number): any => {
  const result = [];
  for (let year = startYear; year <= endYear; year++) {
    result.push({
      year: year.toString(),
      fullDate: `01-01-${year}`,
      income: 0,
      expense: 0,
    });
  }
  // return result;
  return result.reverse();
};