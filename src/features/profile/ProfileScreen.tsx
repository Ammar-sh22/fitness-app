// src/features/profile/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../core/components/Layout/Screen';
import { SectionHeader } from '../../core/components/UI/SectionHeader';
import { Card } from '../../core/components/UI/Card';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING } from '../../core/theme';

type ProfileScreenProps = {
    navigation: any;
};

/* Simple fallback Profile (unused, real one is from features/profile) */
export const FallbackProfileScreen: React.FC = () => {
    const currentUser = useAppStore((s) => s.currentUser);
    return (
        <Screen title="Profile">
            <SectionHeader label="Basic information" />
            <Card>
                <Text style={styles.cardName}>Full name</Text>
                <Text style={styles.cardMeta}>
                    {currentUser?.fullName ?? '[not set]'}
                </Text>
                <Text style={styles.cardName}>Role</Text>
                <Text style={styles.cardMeta}>{currentUser?.role ?? 'Guest'}</Text>
            </Card>
        </Screen>
    );
};

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
    const currentUser = useAppStore((s) => s.currentUser);

    if (!currentUser) {
        return (
            <Screen title="Profile">
                <Text style={styles.textMuted}>No user data yet.</Text>
            </Screen>
        );
    }

    const isProvider =
        currentUser.role === 'coach' || currentUser.role === 'nutritionist';

    return (
        <Screen title="Profile">
            {/* 1. Info section */}
            <SectionHeader label="Information" />
            <Card>
                <Row label="Name" value={currentUser.fullName} />
                <Row label="Role" value={currentUser.role} />
                <Row label="Phone" value={currentUser.phone} />
                <Row label="Email" value={currentUser.email} />
                <Row
                    label="Age"
                    value={currentUser.age ? String(currentUser.age) : undefined}
                />
                {isProvider && (
                    <>
                        <Row label="Title" value={currentUser.title} />
                        <Row
                            label="Experience"
                            value={
                                currentUser.yearsOfExperience
                                    ? `${currentUser.yearsOfExperience} years`
                                    : undefined
                            }
                        />
                        <Row
                            label="Languages"
                            value={currentUser.languages?.join(', ')}
                        />
                        <Row
                            label="Specialties"
                            value={currentUser.specialties?.join(', ')}
                        />
                    </>
                )}
            </Card>

            {/* 2. Attachments (providers only) */}
            {isProvider && (
                <>
                    <SectionHeader label="Attachments" />
                    <Card>
                        <Text style={styles.textMuted}>
                            Here we will show files uploaded by the coach/nutritionist
                            (images, PDFs, etc.).
                        </Text>
                    </Card>
                </>
            )}

            {/* 3. Posts (providers only) */}
            {isProvider && (
                <>
                    <SectionHeader label="Posts" />
                    <Card>
                        <Text style={styles.textMuted}>
                            Here we will show posts created by the coach/nutritionist
                            (tips, workouts, recipes, etc.).
                        </Text>
                    </Card>
                </>
            )}
        </Screen>
    );
};

// small reusable row
const Row: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value ?? '-'}</Text>
    </View>
);

const styles = StyleSheet.create({
    textMuted: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingVertical: SPACING.xs,
    },
    rowLabel: {
        ...TYPOGRAPHY.body,
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    rowValue: {
        ...TYPOGRAPHY.body,
        fontSize: 14,
        color: COLORS.textPrimary,
        maxWidth: '60%',
        textAlign: 'right',
    },
    textCenter: {
        ...TYPOGRAPHY.subtitle,
        textAlign: 'center',
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    cardName: {
        ...TYPOGRAPHY.subtitle,
        fontSize: 16,
        color: COLORS.textPrimary,
    },
    cardMeta: {
        ...TYPOGRAPHY.text,
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
});
