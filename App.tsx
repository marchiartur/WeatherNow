import React, { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import TextInputSearch from './src/components/TextInputSearch';
import {
  getNextFiveDaysForecast,
  ResponseGetNextFiveDaysForecast,
  ResponseSearchByCity,
  searchByCity,
  WeatherApiLocation,
} from './src/domains/weather/api';
import ForecastData from './src/components/Forecast';
import Snackbar from 'react-native-snackbar';
import { format } from 'date-fns';

function App(): React.JSX.Element {
  const [citiesData, setCitiesData] = useState<ResponseSearchByCity>([]);

  const [forecast, setForecast] = useState<ResponseGetNextFiveDaysForecast>(null);

  const [isLoadingCity, setIsLoadingCity] = useState(false);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);

  const [lastTimeUpdated, setLastTimeUpdated] = useState<Date>(null);

  async function getForecast(id: number) {
    try {
      setIsLoadingForecast(true);

      const response = await getNextFiveDaysForecast(id);

      setForecast(response.data);
      setLastTimeUpdated(new Date());
    } catch (error) {
      console.log('error', error);

      Snackbar.show({
        text: 'Error to get forecast',
        backgroundColor: 'red',
      });
    } finally {
      setIsLoadingForecast(false);
    }
  }

  async function onSearchCity(value: string) {
    try {
      if (!value) {
        setCitiesData([]);
        setForecast(undefined);

        return;
      }

      setIsLoadingCity(true);

      const response = await searchByCity(value);

      if (response?.data?.length === 0) {
        setCitiesData([]);
        setForecast(undefined);

        return;
      }

      setCitiesData(response.data);
    } catch (error) {
      console.error('err', error);

      Snackbar.show({
        text: 'Error to get city',
        backgroundColor: 'red',
      });
    } finally {
      setIsLoadingCity(false);
    }
  }

  function extractItem(option: any) {
    return option?.name + ', ' + option?.region + ', ' + option?.country;
  }

  function onSelectOption(value: WeatherApiLocation) {
    getForecast(value.id);
  }

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <Text style={styles.title}>WeatherNow</Text>

      <TextInputSearch
        options={citiesData}
        placeholder="Search for a city"
        onSearch={onSearchCity}
        extractItem={extractItem}
        isLoading={isLoadingCity}
        onSelectOption={onSelectOption}
      />

      <ForecastData data={forecast} isLoading={isLoadingForecast} />

      {lastTimeUpdated ? (
        <Text style={styles.textLastTimeUpdated}>
          Last time updated: {format(lastTimeUpdated, 'Pp')}
        </Text>
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#2E335A',
  },
  title: {
    fontSize: 28,
    fontWeight: 'regular',
    marginBottom: 17,
    color: 'white',
  },
  textLastTimeUpdated: {
    color: 'white',
    fontSize: 10,
  },
});

export default App;
