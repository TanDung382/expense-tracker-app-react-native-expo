import { expenseCategories, incomeCategory } from "@/constants/data";
import { TransactionItemProps, TransactionListType, TransactionType } from "@/types";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from 'react-native-reanimated';
import Loading from "./Loading";

const TransactionList = ({
  data,
  title,
  loading,
  emptyListMessage,
}: TransactionListType) => {
  const router = useRouter();
  const handleClick = (item: TransactionType) => {
    router.push({
      pathname: "/(modals)/transactionModal",
      params: {
        id: item?.id,
        type: item?.type,
        amount: item?.amount?.toString(),
        category: item?.category,
        date: (item.date as Timestamp)?.toDate()?.toISOString(),
        description: item?.description,
        image: item?.image, 
        uid: item?.uid,
        walletId: item?.walletId
      }
    })
  }

  return (
    <View className="gap-4 mt-3">
      {title && (
        <Text className="text-lg text-white font-bold">{title}</Text>
      )}

      {/* danh sách */}
      <View className="min-h-[3px]">
        <FlashList
          data={data}
          renderItem={({ item, index }) => (
            <TransactionItem
              item={item}
              index={index}
              handleClick={handleClick}
            />
          )}
        />
      </View>

      {/* empty message */}
      {!loading && data.length === 0 && (
        <Text          
          className="text-neutral-400 text-center mt-4 text-base"
        >
          {emptyListMessage}
        </Text>
      )}

      {/* loading */}
      {loading && (
        <View className="mt-24">
          <Loading />
        </View>
      )}
    </View>
  );
};

const TransactionItem = ({ item, index, handleClick }: TransactionItemProps) => {
  let category = item?.type == 'income' ? incomeCategory : expenseCategories[item.category!];
  const IconComponent = category.icon;

  const date = (item?.date as Timestamp)
  ?.toDate()
  ?.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });


  const formatVND = (value: number) => {
    if (!value) return "0 đ";
    return value.toLocaleString("vi-VN") + " đ";
  };
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50)}
    >
      <TouchableOpacity
        onPress={() => handleClick(item)}
        className="flex-row justify-between items-center mb-3 bg-neutral-700 rounded-2xl p-2"
      >
        <View
          className="w-11 h-11 justify-center items-center rounded-xl"
          style={{ backgroundColor: category.bgColor }}
        >
          {IconComponent && (
            <IconComponent
              size={25}
              weight="fill"
              color="white"
            />
          )}
        </View>
        <View className="flex-1 ml-2">
          <Text className="text-white text-base">
            {category.label}
          </Text>
          <Text className="text-neutral-400 text-sm">
            {item?.description}
          </Text>
        </View>
        <View className="items-end">
          <Text
            className={`font-medium ${
              item.type === "income" ? "text-lime-500" : "text-red-500"
            }`}
          >
            {item.type === "income" ? "+" : "-"} {formatVND(item.amount)}
          </Text>
          <Text className="text-xs text-neutral-400">
            {date}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};


export default TransactionList;
