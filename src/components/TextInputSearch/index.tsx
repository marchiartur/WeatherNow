import React, { useEffect, useState } from 'react';
import TextInput from '../TextInput';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../../styles/theme';

type TextInputSearchProps<T> = {
  options?: T[];
  onSelectOption?: (value: T) => void;
  extractItem?: (option: T) => string;
  onSearch?: (value: string) => void;
  placeholder?: string;
  onFilterOption?: (value: T) => boolean;
  isLoading?: boolean;
};

const TextInputSearch = <T,>({
  options = [],
  onSelectOption,
  extractItem,
  onSearch,
  placeholder,
  onFilterOption,
  isLoading,
}: TextInputSearchProps<T>) => {
  const [searchText, setSearchText] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardVisible(true),
    );
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardVisible(false),
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const filterOptions = (text: string) => {
    onSearch?.(text);
    setSearchText(text);

    if (typeof onFilterOption === 'function') {
      setFilteredOptions(options.filter(onFilterOption));
    } else {
      // Default filtering if no onFilterOption provided
      setFilteredOptions(options);
    }
  };

  const renderItem = ({ item }: { item: T }) => {
    const handleOptionPress = () => {
      onSelectOption?.(item);

      Keyboard.dismiss();
    };

    return (
      <TouchableOpacity onPress={handleOptionPress}>
        <View style={styles.containerItem}>
          <Text style={styles.textItem}>{extractItem?.(item) ?? String(item)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ItemSeparatorComponent = () => <View style={styles.separator} />;

  return (
    <View style={styles.container}>
      <TextInput
        inlineImageLeft="search"
        placeholder={placeholder}
        value={searchText}
        onChangeText={filterOptions}
      />

      {(filteredOptions?.length > 0 || isLoading) && isKeyboardVisible && (
        <LinearGradient style={styles.gradient} useAngle angle={70} colors={['#2E335A', '#1C1B33']}>
          <FlatList
            data={filteredOptions}
            renderItem={renderItem}
            keyboardShouldPersistTaps="handled"
            ListFooterComponent={isLoading ? <ActivityIndicator /> : null}
            ItemSeparatorComponent={ItemSeparatorComponent}
            keyExtractor={(item, index) => index.toString()}
          />
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  containerItem: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  textItem: {
    color: theme.textColor,
    fontSize: 16,
  },
  gradient: {
    borderRadius: 10,
    maxHeight: 200,
    marginTop: 8,
    position: 'absolute',
    zIndex: 999,
    top: 30,
    width: '100%',
  },
  separator: {
    backgroundColor: theme.textColor,
    height: 1,
    opacity: 0.2,
    marginHorizontal: 16,
  },
});

export default TextInputSearch;
