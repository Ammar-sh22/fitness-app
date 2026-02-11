import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../../theme';
import { BlurView } from 'expo-blur';

type CardProps = ViewProps & {
    children: React.ReactNode;
};

export const Card: React.FC<CardProps> = ({ children, style, ...rest }) => (
    <BlurView intensity={20} tint="default" style={styles.heroBlur}>
        <View style={[styles.card, style]} {...rest}>
            {children}
        </View>
    </BlurView>
);

const styles = StyleSheet.create({


    card: {
        backgroundColor: COLORS.calssBackground,
        borderRadius: RADIUS.lg ?? RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.brandSoft ?? COLORS.border,
        overflow: 'hidden', // keeps blur inside rounded corners

    },
    heroBlur: {
        marginVertical: SPACING.xs,
        borderRadius: RADIUS.lg,
        paddingVertical: 5,
        paddingHorizontal: 5,
        overflow: 'hidden', // keeps blur inside rounded corners
    }

});
