import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../../theme';

type ButtonPrimaryProps = {
    label: string;
    onPress: () => void;
};

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
    label,
    onPress,
}) => (
    <TouchableOpacity style={styles.primary} onPress={onPress}>
        <Text style={styles.primaryText}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    primary: {
        backgroundColor: COLORS.brand,
        borderRadius: RADIUS.pill,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryText: {
        ...TYPOGRAPHY.button,
        color: COLORS.black,
    },
    secondary: {
        backgroundColor: 'transparent',
        borderRadius: RADIUS.pill,
        paddingVertical: SPACING.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.brand,
    },
    secondaryText: {
        ...TYPOGRAPHY.button,
        color: COLORS.brand,
    },
});
