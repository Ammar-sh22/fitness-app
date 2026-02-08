// src/features/tasks/TaskDetailsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Screen } from '../../core/components/Layout/Screen';
import { SectionHeader } from '../../core/components/UI/SectionHeader';
import { Card } from '../../core/components/UI/Card';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING } from '../../core/theme';

type TaskDetailsScreenProps = {
    route: any;
};

export const TaskDetailsScreen: React.FC<TaskDetailsScreenProps> = ({ route }) => {
    const { date } = route.params as { date: string };

    const tasks = useAppStore((s) => s.tasks);
    const tasksForDate = tasks.filter((t) => t.date === date);

    const readableDate = new Date(date).toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
    });

    const renderItem = ({ item }: any) => (
        <View style={styles.cardWrapper}>
            <Card>
                <Text style={styles.title}>{item.title}</Text>
                {item.description ? (
                    <Text style={styles.subtitle}>{item.description}</Text>
                ) : null}
                <Text style={styles.meta}>Status: {item.status}</Text>
            </Card>
        </View>
    );

    return (
        <Screen title="Tasks details">
            <SectionHeader label={readableDate} />
            {tasksForDate.length === 0 ? (
                <Text style={styles.textMuted}>No tasks for this day.</Text>
            ) : (
                <FlatList
                    data={tasksForDate}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </Screen>
    );
};

const styles = StyleSheet.create({
    textMuted: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: SPACING.md,
    },
    listContent: {
        paddingBottom: SPACING.lg,
    },
    cardWrapper: {
        marginBottom: SPACING.sm,
    },
    title: {
        ...TYPOGRAPHY.subtitle,
        color: COLORS.textPrimary,
    },
    subtitle: {
        ...TYPOGRAPHY.body,
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    meta: {
        ...TYPOGRAPHY.text,
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
});
