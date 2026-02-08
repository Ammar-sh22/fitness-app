// src/features/home/DiscoverScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
} from 'react-native';

import { Screen } from '../../core/components/Layout/Screen';
import { SectionHeader } from '../../core/components/UI/SectionHeader';
import { Card } from '../../core/components/UI/Card';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../core/theme';

type DiscoverScreenProps = {
    route: any;
    navigation: any;
};

type RoleFilter = 'all' | 'coach' | 'nutritionist';

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
    route,
    navigation,
}) => {
    const providers = useAppStore((s) => s.providers);

    const [search, setSearch] = React.useState('');
    const [roleFilter, setRoleFilter] = React.useState<RoleFilter>('all');

    // update filter whenever route.params.role changes
    React.useEffect(() => {
        const paramRole = route.params?.role as RoleFilter | undefined;
        if (paramRole === 'coach' || paramRole === 'nutritionist' || paramRole === 'all') {
            setRoleFilter(paramRole);
        }
    }, [route.params?.role]);

    const filteredProviders = providers
        .filter((p) => {
            if (roleFilter === 'all') return true;
            return p.role === roleFilter;
        })
        .filter((p) => {
            if (!search.trim()) return true;
            return p.fullName.toLowerCase().includes(search.toLowerCase());
        });

    const handleOpenProvider = (providerId: string) => {
        navigation.navigate('ProviderPackages', { providerId });
    };

    const renderProvider = ({ item }: any) => (
        <TouchableOpacity onPress={() => handleOpenProvider(item.id)}>
            <Card>
                <Text style={styles.name}>{item.fullName}</Text>
                <Text style={styles.meta}>
                    {item.title}{' '}
                    {item.role === 'coach' ? '· Coach' : '· Nutritionist'}
                </Text>
                <Text style={styles.meta}>
                    {item.yearsOfExperience} yrs · {item.languages.join(', ')}
                </Text>
            </Card>
        </TouchableOpacity>
    );

    return (
        <Screen title="Discover">
            <SectionHeader label="Search" />

            <TextInput
                style={styles.input}
                placeholder="Search by name"
                placeholderTextColor={COLORS.textSecondary}
                value={search}
                onChangeText={setSearch}
            />

            <View style={styles.filterRow}>
                <FilterChip
                    label="All"
                    active={roleFilter === 'all'}
                    onPress={() => setRoleFilter('all')}
                />
                <FilterChip
                    label="Coaches"
                    active={roleFilter === 'coach'}
                    onPress={() => setRoleFilter('coach')}
                />
                <FilterChip
                    label="Nutritionists"
                    active={roleFilter === 'nutritionist'}
                    onPress={() => setRoleFilter('nutritionist')}
                />
            </View>

            <SectionHeader label="Providers" />

            {filteredProviders.length === 0 ? (
                <Text style={styles.textMuted}>No providers found.</Text>
            ) : (
                <FlatList
                    data={filteredProviders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderProvider}
                    contentContainerStyle={{ paddingBottom: SPACING.lg }}
                />
            )}
        </Screen>
    );
};

type FilterChipProps = {
    label: string;
    active: boolean;
    onPress: () => void;
};

const FilterChip: React.FC<FilterChipProps> = ({
    label,
    active,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.chip,
                active && styles.chipActive,
            ]}
            onPress={onPress}
        >
            <Text
                style={[
                    styles.chipText,
                    active && styles.chipTextActive,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm + 2,
        marginBottom: SPACING.sm,
        fontSize: 14,
        color: COLORS.textPrimary,
        backgroundColor: COLORS.surface,
    },
    textMuted: {
        ...TYPOGRAPHY.label,
        textAlign: 'center',
        marginTop: SPACING.sm,
    },
    filterRow: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
    },
    chip: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.pill,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginRight: SPACING.sm,
        backgroundColor: COLORS.surface,
    },
    chipActive: {
        borderColor: COLORS.brand,
        backgroundColor: COLORS.brandDark,
    },
    chipText: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    chipTextActive: {
        color: COLORS.brand,
        fontWeight: '600',
    },
    name: {
        ...TYPOGRAPHY.subtitle,
    },
    meta: {
        ...TYPOGRAPHY.label,
        marginTop: 2,
    },
});
