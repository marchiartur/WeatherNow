import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../../styles/theme';

type TextInputProps = {} & RNTextInputProps;

const TextInput: React.FC<TextInputProps> = ({ ...props }) => {
  return (
    <LinearGradient style={styles.containerGradient} colors={['#2E335A', '#1C1B33']}>
      <RNTextInput
        style={styles.container}
        placeholderTextColor={theme.textColor}
        inlineImagePadding={4}
        {...props}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  containerGradient: {
    borderRadius: 10,
    height: 36,
  },
  container: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 17,
    textAlignVertical: 'center',
    lineHeight: 22,
    color: theme.textColor,
  },
});

export default TextInput;
