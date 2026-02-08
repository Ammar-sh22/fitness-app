// src/features/tasks/TasksScreen.tsx
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

type TasksScreenProps = {
    navigation: any;
};

export const TasksScreen: React.FC<TasksScreenProps> = ({ navigation }) => {
    const tasks = useAppStore((s) => s.tasks);

    const today = new Date();
    const [selectedDate, setSelectedDate] = React.useState(
        today.toISOString().slice(0, 10),
    );

    // Build current month days (1..30) as ISO strings
    const year = today.getFullYear();
    const month = today.getMonth(); // 0-11

    const monthDays: { iso: string; label: string }[] = [];
    for (let day = 1; day <= 30; day++) {
        const d = new Date(year, month, day);
        const iso = d.toISOString().slice(0, 10);
        monthDays.push({
            iso,
            label: day.toString(),
        });
    }

    const tasksForSelectedDay = tasks.filter((t) => t.date === selectedDate);

    const handleOpenDetails = () => {
        navigation.navigate('TaskDetails', { date: selectedDate });
    };

    const renderTaskItem = ({ item }: any) => (
        <Card>
            <Text style={styles.taskTitle}>{item.title}</Text>
            {item.description ? (
                <Text style={styles.taskSubtitle}>{item.description}</Text>
            ) : null}
            <Text style={styles.taskMeta}>Status: {item.status}</Text>
        </Card>
    );

    return (
        <Screen title="Tasks">
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator
            >
                {/* Calendar grid */}
                <SectionHeader label="Calendar" />
                <View style={styles.calendarGrid}>
                    {monthDays.map((day) => {
                        const isActive = day.iso === selectedDate;
                        return (
                            <TouchableOpacity
                                key={day.iso}
                                style={[
                                    styles.dayCell,
                                    isActive && styles.dayCellActive,
                                ]}
                                onPress={() => setSelectedDate(day.iso)}
                            >
                                <Text
                                    style={[
                                        styles.dayNumber,
                                        isActive && styles.dayNumberActive,
                                    ]}
                                >
                                    {day.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Tasks list for selected day */}
                <SectionHeader label="Tasks" />
                <View style={styles.listContainer}>
                    {tasksForSelectedDay.length === 0 ? (
                        <Text style={styles.textMuted}>No tasks for this day.</Text>
                    ) : (
                        <FlatList
                            data={tasksForSelectedDay}
                            keyExtractor={(item) => item.id}
                            renderItem={renderTaskItem}
                            scrollEnabled={false}
                            contentContainerStyle={{ paddingBottom: SPACING.lg }}
                            ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
                        />
                    )}
                </View>

                {tasksForSelectedDay.length > 0 && (
                    <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={handleOpenDetails}
                    >
                        <Text style={styles.detailsButtonText}>View as list</Text>
                    </TouchableOpacity>
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
        flexGrow: 1,
    },
    textMuted: {
        ...TYPOGRAPHY.label,
        textAlign: 'center',
        marginTop: SPACING.sm,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.lg,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.xs,
        marginBottom: SPACING.xs,
        backgroundColor: COLORS.surface,
    },
    dayCell: {
        width: '14.28%', // 7 columns
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: RADIUS.md,
    },
    dayCellActive: {
        backgroundColor: COLORS.brand,
    },
    // full height text centered in both states
    dayNumber: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        textAlignVertical: 'center', // Android
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    dayNumberActive: {
        color: COLORS.white,
        fontWeight: '600',
    },
    listContainer: {
        minHeight: 300,
    },
    taskTitle: {
        ...TYPOGRAPHY.subtitle,
    },
    taskSubtitle: {
        ...TYPOGRAPHY.body,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    taskMeta: {
        ...TYPOGRAPHY.label,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    detailsButton: {
        marginTop: SPACING.md,
        alignSelf: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.pill ?? 20,
        borderWidth: 1,
        borderColor: COLORS.brand,
        marginBottom: SPACING.lg,
    },
    detailsButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.brand,
    },
});
