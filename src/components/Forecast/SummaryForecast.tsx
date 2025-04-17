import React from 'react';
import { Forecastday } from '../../domains/weather/api';
import { Image, StyleSheet, Text, View } from 'react-native';
import { format, isToday, parseISO } from 'date-fns';
import { renderTemperature } from '../../domains/weather/temperature';

type SummaryForecastProps = {
  data: Forecastday;
};

const SummaryForecast: React.FC<SummaryForecastProps> = ({ data }) => {
  const parsedDate = parseISO(data.date);
  const isSelected = isToday(parsedDate);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? '#48319D' : 'rgba(72, 49, 157, 0.2)',
        },
      ]}
    >
      <Text style={styles.textDay}>{format(parsedDate, 'EEE')}</Text>

      <Image
        width={40}
        height={40}
        style={{
          alignSelf: 'center',
        }}
        source={{ uri: 'https://' + data.day.condition.icon.slice(2) }}
      />

      <Text style={styles.textTemperature}>
        {renderTemperature(Math.round(data.day.avgtemp_c), true)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 30,
    width: 60,
    maxHeight: 146,
    marginRight: 12,
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
    textAlign: 'center',
    shadowOpacity: 0.5,
  },
  textDay: {
    fontWeight: 'bold',
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
  },
  textTemperature: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
});

export default SummaryForecast;
