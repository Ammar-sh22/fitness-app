import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../theme';

export const SectionHeader: React.FC<{ label: string }> = ({ label }) => (
    <Text style={styles.sectionHeader}>{label}</Text>
);

const styles = StyleSheet.create({
    sectionHeader: {
        width: '90%',
        height: 'auto',
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.brandSoft,
        marginTop: 16,
    },
});
