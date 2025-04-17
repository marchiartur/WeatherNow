import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Forecastday, ResponseGetNextFiveDaysForecast } from '../../domains/weather/api';
import SummaryForecast from './SummaryForecast';
import { format } from 'date-fns';
import { renderTemperature } from '../../domains/weather/temperature';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Empty from '../../assets/undraw_location-search_nesh.svg';

type ForecastDataProps = {
  data?: ResponseGetNextFiveDaysForecast;
  isLoading?: boolean;
};

const ForecastData: React.FC<ForecastDataProps> = ({ data, isLoading }) => {
  const currentDay = data?.forecast.forecastday[0];

  const [isCelsius, setIsCelsius] = useState(isLoading);

  function renderItem({ item }: { item: Forecastday }) {
    return <SummaryForecast data={item} />;
  }

  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const todayIndex = data?.forecast.forecastday.findIndex((day) => day.date === todayStr);

  const forecastDays = data?.forecast.forecastday.slice(
    Math.max(0, todayIndex),
    Math.min(todayIndex + 6, data?.forecast.forecastday.length),
  );

  const ListHeaderComponent = () => {
    if (!data) return null;

    return (
      <>
        {isLoading ? (
          <SkeletonPlaceholder borderRadius={10}>
            <SkeletonPlaceholder.Item
              style={[
                styles.textTemperature,
                {
                  alignSelf: 'center',
                },
              ]}
              height={41}
              width={'50%'}
            />
          </SkeletonPlaceholder>
        ) : (
          <Text style={styles.textCityName}>{data?.location?.name}</Text>
        )}

        {isLoading ? (
          <SkeletonPlaceholder shimmerWidth={100} enabled>
            <SkeletonPlaceholder.Item
              width={'70%'}
              height={96}
              style={{
                marginBottom: 12,
                alignSelf: 'center',
              }}
              borderRadius={10}
            />
          </SkeletonPlaceholder>
        ) : (
          <Text style={styles.textTemperature}>
            {renderTemperature(data?.current.temp_c, isCelsius)}
          </Text>
        )}

        {isLoading ? (
          <SkeletonPlaceholder enabled>
            <SkeletonPlaceholder.Item
              width={'70%'}
              height={20}
              borderRadius={10}
              style={{
                marginBottom: 12,
                alignSelf: 'center',
              }}
            />
          </SkeletonPlaceholder>
        ) : (
          <Text style={styles.textCondition}>{data?.current.condition.text}</Text>
        )}

        <View style={styles.rowHighLowTemperature}>
          {isLoading ? (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item borderRadius={10} height={16} width={40} style={{}} />
            </SkeletonPlaceholder>
          ) : (
            <Text style={styles.textSummaryMaxLow}>
              H: {renderTemperature(Math.round(currentDay?.day.maxtemp_c ?? 0), isCelsius)}
            </Text>
          )}

          {isLoading ? (
            <SkeletonPlaceholder>
              <SkeletonPlaceholder.Item
                borderRadius={10}
                height={16}
                width={40}
                style={styles.textSummaryMaxLow}
              />
            </SkeletonPlaceholder>
          ) : (
            <Text style={styles.textSummaryMaxLow}>
              L: {renderTemperature(Math.round(currentDay?.day.mintemp_c ?? 0), isCelsius)}
            </Text>
          )}
        </View>
      </>
    );
  };

  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        <Empty width={200} height={200} />

        <Text style={styles.textEmpty}>No city selected</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ListHeaderComponent />

      {isLoading ? (
        <View style={{ marginTop: 20 }}>
          <SkeletonPlaceholder borderRadius={20}>
            <SkeletonPlaceholder.Item height={146} />
          </SkeletonPlaceholder>
        </View>
      ) : (
        <FlatList
          data={forecastDays}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          horizontal
          nestedScrollEnabled
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={{
            flexGrow: 1,
          }}
          style={{
            flex: 1,
            flexGrow: 1,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 80,
  },
  textCityName: {
    fontSize: 34,
    textAlign: 'center',
    lineHeight: 41,
    color: 'white',
    marginBottom: 12,
  },
  textTemperature: {
    fontSize: 96,
    lineHeight: 96,
    textAlign: 'center',
    color: 'white',
    marginBottom: 12,
  },
  rowHighLowTemperature: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
  },
  textCondition: {
    color: '#EBEBF5',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textSummaryMaxLow: {
    color: 'white',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  textEmpty: {
    color: 'white',
    fontSize: 20,
  },
});

export default ForecastData;
