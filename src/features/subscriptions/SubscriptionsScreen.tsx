// src/features/subscriptions/SubscriptionsScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native';
import { Screen } from '../../core/components/Layout/Screen';
import { SectionHeader } from '../../core/components/UI/SectionHeader';
import { Card } from '../../core/components/UI/Card';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../core/theme';

type SubscriptionsScreenProps = {
    navigation: any;
};

export const SubscriptionsScreen: React.FC<SubscriptionsScreenProps> = () => {
    const currentUser = useAppStore((s) => s.currentUser);
    const subscriptions = useAppStore((s) => s.subscriptions);
    const providers = useAppStore((s) => s.providers);
    const packages = useAppStore((s) => s.packages);

    if (!currentUser) {
        return (
            <Screen title="Subscriptions">
                <Text style={styles.textMuted}>
                    Please sign up or log in to see subscriptions.
                </Text>
            </Screen>
        );
    }

    const isProvider =
        currentUser.role === 'coach' || currentUser.role === 'nutritionist';

    const visibleSubs = isProvider
        ? subscriptions.filter((sub) => sub.providerId === currentUser.id)
        : subscriptions.filter((sub) => sub.clientId === currentUser.id);

    const renderSubscription = ({ item }: any) => {
        const provider = providers.find((p) => p.id === item.providerId);
        const pack = packages.find((p) => p.id === item.packageId);

        return (
            <Card>
                <Text style={styles.packTitle}>{pack?.title ?? 'Package'}</Text>

                {isProvider ? (
                    <Text style={styles.metaText}>
                        Client:{' '}
                        <Text style={styles.metaHighlight}>{item.clientId}</Text>
                    </Text>
                ) : (
                    <Text style={styles.metaText}>
                        Provider:{' '}
                        <Text style={styles.metaHighlight}>
                            {provider?.fullName ?? 'Unknown'} (
                            {provider?.role === 'coach' ? 'Coach' : 'Nutritionist'})
                        </Text>
                    </Text>
                )}

                <Text style={styles.status}>
                    Status:{' '}
                    <Text style={styles.metaHighlight}>{item.status}</Text>
                </Text>

                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.renewButton]}
                        onPress={() =>
                            alert('Renew (fake) – to connect with backend later.')
                        }
                    >
                        <Text style={styles.actionText}>Renew</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.cancelButton]}
                        onPress={() =>
                            alert('Cancel (fake) – to connect with backend later.')
                        }
                    >
                        <Text style={styles.actionText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Card>
        );
    };

    return (
        <Screen title="Subscriptions">
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                <SectionHeader
                    label={isProvider ? 'Your clients subscriptions' : 'Your subscriptions'}
                />

                {visibleSubs.length === 0 ? (
                    <Text style={styles.textMuted}>
                        {isProvider
                            ? 'No clients subscribed to your packages yet.'
                            : 'You have no subscriptions yet.'}
                    </Text>
                ) : (
                    <FlatList
                        data={visibleSubs}
                        keyExtractor={(item) => item.id}
                        renderItem={renderSubscription}
                        contentContainerStyle={{ paddingBottom: SPACING.lg }}
                    />
                )}
            </ScrollView>
        </Screen>
    );
};

const styles = StyleSheet.create({
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
        paddingTop: SPACING.sm,
    },
    textMuted: {
        ...TYPOGRAPHY.label,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    packTitle: {
        ...TYPOGRAPHY.subtitle,
    },
    metaText: {
        ...TYPOGRAPHY.label,
        marginTop: 2,
    },
    metaHighlight: {
        color: COLORS.brand,
    },
    status: {
        ...TYPOGRAPHY.label,
        marginTop: 4,
    },
    actionsRow: {
        flexDirection: 'row',
        marginTop: SPACING.sm,
    },
    actionButton: {
        flex: 1,
        paddingVertical: SPACING.sm,
        marginRight: SPACING.sm,
        borderRadius: RADIUS.pill,
        alignItems: 'center',
    },
    renewButton: {
        backgroundColor: COLORS.brand,
    },
    cancelButton: {
        backgroundColor: COLORS.danger,
    },
    actionText: {
        color: COLORS.black,
        fontSize: 14,
        fontWeight: '600',
    },
});
