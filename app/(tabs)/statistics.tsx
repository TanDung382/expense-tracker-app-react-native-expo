import { useAuth } from '@/contexts/authContext';
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from '@/services/transactionService';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import Loading from '../components/Loading';
import ScreenWrapper from '../components/ScreenWrapper';
import TransactionList from '../components/TransactionList';

const Statistics = () => {
  const { user } = useAuth();
  const [chartLoading, setChartLoading] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (activeIndex === 0) getWeeklyStats();
      if (activeIndex === 1) getMonthlyStats();
      if (activeIndex === 2) getYearlyStats();
    }, [activeIndex])
  );

  const getWeeklyStats = async () => {
    setChartLoading(true);
    let res = await fetchWeeklyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Lỗi", res.msg)
    }
  };

  const getMonthlyStats = async () => {
    setChartLoading(true);
    let res = await fetchMonthlyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Lỗi", res.msg)
    }
  };

  const getYearlyStats = async () => {
    setChartLoading(true);
    let res = await fetchYearlyStats(user?.uid as string);
    setChartLoading(false);
    if (res.success) {
      setChartData(res?.data?.stats);
      setTransactions(res?.data?.transactions);
    } else {
      Alert.alert("Lỗi", res.msg)
    }
  };

  return (
    <ScreenWrapper className="flex-1">      
      <View className="px-4 pt-4">
        <Text className="text-white text-lg font-semibold">Biểu đồ</Text>
      </View>

      {/* Nội dung */}
      <ScrollView
        className="flex-1 gap-5 py-2 pb-24 px-5"
        showsVerticalScrollIndicator={false}
      >
        {/* SegmentedControl */}
        <SegmentedControl
          values={['Tuần', 'Tháng', 'Năm']}
          selectedIndex={activeIndex}
          onChange={(event) =>
            setActiveIndex(event.nativeEvent.selectedSegmentIndex)
          }
          backgroundColor="#262626"
          tintColor="#22c55e"
          appearance="dark"
          style={{ height: 37, borderRadius: 8 }}
          fontStyle={{ fontSize: 13, fontWeight: 'bold', color: '#a3a3a3' }}
          activeFontStyle={{ fontSize: 13, fontWeight: 'bold', color: '#ffffff' }}
        />


        {/* Chart */}
        <View className="items-center justify-center relative pt-4">
          {chartData.length > 0 ? (
            <BarChart
              data={chartData}
              barWidth={activeIndex === 0 ? 12 : activeIndex === 1 ? 18 : 14}
              spacing={12}
              roundedTop
              roundedBottom
              hideRules
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisLabelWidth={40}
              formatYLabel={(value) => {
                const num = Number(value);
                if (num >= 1_000_000_000) return Math.floor(num / 1_000_000_000) + 'B';
                if (num >= 1_000_000) return Math.floor(num / 1_000_000) + 'M';
                if (num >= 1_000) return Math.floor(num / 1_000) + 'K';
                return num.toString();
              }}
              xAxisLabelTextStyle={{ color: "#a3a3a3", fontSize: 12 }}
              yAxisTextStyle={{ color: "#a3a3a3" }}
              noOfSections={5}
              animationDuration={1000}
            />
          ) : (            
              <View className="w-full h-[210px] bg-black/60 rounded-xl items-center justify-center">
                <Loading/>
              </View>
          )}
          {chartLoading && (
            <Loading />
          )}
        </View>
        <View>
          <TransactionList
            title='Giao dịch'
            emptyListMessage='Không tìm thấy giao dịch'
            data={transactions}
          />
        </View>
      </ScrollView>
      
    </ScreenWrapper>
  );
};

export default Statistics;
