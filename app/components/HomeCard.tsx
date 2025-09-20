import { useAuth } from "@/contexts/authContext";
import useFetchData from "@/hooks/useFetchData";
import { WalletType } from "@/types";
import { orderBy, where } from "firebase/firestore";
import * as Icons from "phosphor-react-native";
import { useState } from "react";
import { ImageBackground, Text, View } from "react-native";
import Loading from "./Loading";

const HomeCard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const formatVND = (value: number) => {
    if (isNaN(value)) return "0 đ";
    return value
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  const {
    data: wallets,
    loading: walletLoading,
    error,
  } = useFetchData<WalletType>("wallets", [
    where("uid", "==", user?.uid),
    orderBy("created", "desc"),
  ]);

  const getTotals = () => {
    return wallets.reduce((totals: any, item: WalletType) => {
      totals.balance = totals.balance + Number(item.amount);
      totals.income = totals.income + Number(item.totalIncome);
      totals.expenses = totals.expenses + Number(item.totalExpenses);

      return totals;
    }, {balance: 0, income: 0, expenses: 0})
  }

  return (
    <ImageBackground
      source={require("../../assets/images/card.png")}
      resizeMode="stretch"
      className="h-[210px] w-full"
    >
      {isLoading && <Loading />}
      <View className="px-6 py-5 h-[87%] w-full justify-between">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-neutral-800 text-[17px] font-medium">
            Tổng số dư
          </Text>
          <Icons.DotsThreeOutlineIcon size={23} color="black" weight="fill" />
        </View>
        <Text className="text-neutral-900 text-[28px] font-bold -mt-1">
          {walletLoading ? "----" : formatVND(getTotals()?.balance)}
        </Text>

        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-col items-center">
            <View className="flex-row items-center space-x-1">
              <View className="bg-neutral-300 p-1 rounded-full">
                <Icons.ArrowDownIcon
                  size={15}
                  color="black"
                  weight="bold" />
              </View>
              <Text className="text-neutral-900 text-[16px] font-medium ml-2">
                Thu nhập
              </Text>
            </View>
            <Text className="text-green text-[17px] font-semibold mt-1">
              {walletLoading ? "----" : formatVND(getTotals()?.income)}
            </Text>
          </View>

          <View className="flex-col items-center">
            <View className="flex-row items-center space-x-1">
              <View className="bg-neutral-300 p-1 rounded-full">
                <Icons.ArrowUpIcon size={15} color="black" weight="bold" />
              </View>
              <Text className="text-neutral-900 text-[16px] font-medium ml-2">
                Chi phí
              </Text>
            </View>
            <Text className="text-rose text-[17px] font-semibold mt-1">
              {walletLoading ? "----" : formatVND(getTotals()?.expenses)}
            </Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default HomeCard;
