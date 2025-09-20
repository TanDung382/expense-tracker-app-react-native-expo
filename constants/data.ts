import { CategoryType, ExpenseCategoriesType } from "@/types";
import * as Icons from "phosphor-react-native"; // Import all icons dynamically

export const expenseCategories: ExpenseCategoriesType = {
  groceries: {
    label: "Mua sắm",
    value: "groceries",
    icon: Icons.ShoppingCartIcon,
    bgColor: "#4B5563",
  },
  rent: {
    label: "Thuê nhà",
    value: "rent",
    icon: Icons.HouseIcon,
    bgColor: "#075985",
  },
  utilities: {
    label: "Tiện ích",
    value: "utilities",
    icon: Icons.LightbulbIcon,
    bgColor: "#ca8a04",
  },
  transportation: {
    label: "Đi lại",
    value: "transportation",
    icon: Icons.CarIcon,
    bgColor: "#b45309",
  },
  entertainment: {
    label: "Giải trí",
    value: "entertainment",
    icon: Icons.FilmStripIcon,
    bgColor: "#0f766e",
  },
  dining: {
    label: "Ăn uống",
    value: "dining",
    icon: Icons.ForkKnifeIcon,
    bgColor: "#be185d",
  },
  health: {
    label: "Sức khỏe",
    value: "health",
    icon: Icons.HeartIcon,
    bgColor: "#e11d48",
  },
  insurance: {
    label: "Bảo hiểm",
    value: "insurance",
    icon: Icons.ShieldCheckIcon,
    bgColor: "#404040",
  },
  savings: {
    label: "Tiết kiệm",
    value: "savings",
    icon: Icons.PiggyBankIcon,
    bgColor: "#065f46",
  },
  clothing: {
    label: "Quần áo",
    value: "clothing",
    icon: Icons.TShirtIcon,
    bgColor: "#7c3aed",
  },
  personal: {
    label: "Cá nhân",
    value: "personal",
    icon: Icons.UserIcon,
    bgColor: "#a21caf",
  },
  others: {
    label: "Khác",
    value: "others",
    icon: Icons.DotsThreeOutlineIcon,
    bgColor: "#525252",
  },
};

export const incomeCategory: CategoryType = {
  label: "Thu nhập",
  value: "income",
  icon: Icons.CurrencyDollarSimpleIcon,
  bgColor: "#16a34a",
};

export const transactionTypes = [
  { label: "Chi tiêu", value: "expense" },
  { label: "Thu nhập", value: "income" },
];
