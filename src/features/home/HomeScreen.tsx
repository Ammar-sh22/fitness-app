// src/features/home/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

import { Screen } from '../../core/components/Layout/Screen';
import { SectionHeader } from '../../core/components/UI/SectionHeader';
import { ButtonPrimary } from '../../core/components/UI/Button';
import { Card } from '../../core/components/UI/Card';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../core/theme';

type RootStackParamList = {
    ProviderPackages: { providerId: string };
    Discover: { role: 'coach' | 'nutritionist' } | undefined;
    Tasks: undefined;
};

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const currentUser = useAppStore((s) => s.currentUser);
    const currentProviderId = useAppStore((s) => s.currentProviderId);
    const tasks = useAppStore((s) => s.tasks);
    const providers = useAppStore((s) => s.providers);

    const roleLabel = currentUser?.role ?? 'Guest';
    const today = new Date().toISOString().slice(0, 10);

    const todayTasks = currentProviderId
        ? tasks.filter(
            (t) => t.providerId === currentProviderId && t.date === today,
        )
        : [];

    const coaches = providers.filter((p) => p.role === 'coach');
    const nutritionists = providers.filter((p) => p.role === 'nutritionist');

    return (
        <Screen title="Home">
            <View style={styles.headerCard}>
                <Text style={styles.welcomeTitle}>
                    Welcome back{currentUser?.fullName ? `, ${currentUser.fullName}` : ''}!
                </Text>
                <Text style={styles.welcomeSubtitle}>Role: {roleLabel}</Text>
            </View>

            {!currentProviderId && (
                <Text style={styles.textCenter}>
                    No active package yet. Go to Discover, choose a provider and pay to see
                    tasks.
                </Text>
            )}

            {currentProviderId && (
                <View style={styles.section}>
                    <SectionHeader label="Today's tasks" />
                    {todayTasks.length === 0 ? (
                        <Text style={styles.textMuted}>No tasks for today.</Text>
                    ) : (
                        todayTasks.map((task) => (
                            <Card key={task.id}>
                                <Text style={styles.cardName}>{task.title}</Text>
                                {task.description ? (
                                    <Text style={styles.cardDescription}>{task.description}</Text>
                                ) : null}
                                <Text style={styles.cardMeta}>Status: {task.status}</Text>
                            </Card>
                        ))
                    )}
                </View>
            )}

            <View style={styles.section}>
                <SectionHeader label="Coaches" />
                <View style={styles.horizontalList}>
                    {coaches.map((p) => (
                        <TouchableOpacity
                            key={p.id}
                            style={styles.providerCard}
                            onPress={() =>
                                navigation.navigate('ProviderPackages', { providerId: p.id })
                            }
                        >
                            <Text style={styles.cardName}>{p.fullName}</Text>
                            <Text style={styles.cardMeta}>{p.yearsOfExperience} yrs</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate('Discover', { role: 'coach' })}
                >
                    <Text style={styles.viewMore}>View more coaches</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <SectionHeader label="Nutritionists" />
                <View style={styles.horizontalList}>
                    {nutritionists.map((p) => (
                        <TouchableOpacity
                            key={p.id}
                            style={styles.providerCard}
                            onPress={() =>
                                navigation.navigate('ProviderPackages', { providerId: p.id })
                            }
                        >
                            <Text style={styles.cardName}>{p.fullName}</Text>
                            <Text style={styles.cardMeta}>{p.yearsOfExperience} yrs</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('Discover', { role: 'nutritionist' })
                    }
                >
                    <Text style={styles.viewMore}>View more nutritionists</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <ButtonPrimary
                    label="Open tasks page"
                    onPress={() => navigation.navigate('Tasks')}
                />
            </View>
        </Screen>
    );
};

const styles = StyleSheet.create({
    headerCard: {
        width: '100%',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    welcomeTitle: {
        ...TYPOGRAPHY.title,
    },
    welcomeSubtitle: {
        ...TYPOGRAPHY.label,
        marginTop: 4,
        color: COLORS.brand,
    },
    textMuted: {
        ...TYPOGRAPHY.label,
        textAlign: 'center',
        marginBottom: SPACING.sm,
    },
    textCenter: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    section: {
        width: '100%',
        marginTop: SPACING.md,
    },
    horizontalList: {
        flexDirection: 'row',
        marginTop: SPACING.sm,
    },
    providerCard: {
        flex: 1,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        padding: SPACING.sm,
        marginRight: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardName: {
        ...TYPOGRAPHY.subtitle,
    },
    cardDescription: {
        ...TYPOGRAPHY.body,
        marginTop: 4,
    },
    cardMeta: {
        ...TYPOGRAPHY.label,
        marginTop: 4,
    },
    viewMore: {
        fontSize: 13,
        color: COLORS.brand,
        textAlign: 'right',
        marginTop: 4,
    },
    footer: {
        marginTop: SPACING.lg,
    },
});
