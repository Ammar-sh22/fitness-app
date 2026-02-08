import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const COLORS = {
  background: '#FFFFFF',
  text: '#1F2933',
  primary: '#0d7f09',
};

type LoadingScreenProps = {
  message?: string;
};

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>
        {message ?? 'Loading...'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: COLORS.text,
  },
});
