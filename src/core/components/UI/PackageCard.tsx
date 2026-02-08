import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const COLORS = {
  text: '#1F2933',
  muted: '#9CA3AF',
  primary: '#2F80ED',
  border: '#E5E7EB',
};

type PackageCardProps = {
  title: string;
  durationInDays: number;
  price: number;
  currency: string;
  description?: string;
  onPress?: () => void;
  actionLabel?: string;
};

export const PackageCard: React.FC<PackageCardProps> = ({
  title,
  durationInDays,
  price,
  currency,
  description,
  onPress,
  actionLabel = 'Select',
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.duration}>{durationInDays} days</Text>
      <Text style={styles.price}>
        {price} {currency}
      </Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {onPress && (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  duration: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: 4,
  },
  description: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
  },
  button: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
