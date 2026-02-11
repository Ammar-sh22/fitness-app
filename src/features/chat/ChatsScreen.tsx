// src/features/chat/ChatsScreen.tsx
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

type ChatsScreenProps = {
    navigation: any;
};

type ChatFilter = 'all' | 'subscribed' | 'not_subscribed';

export const ChatsScreen: React.FC<ChatsScreenProps> = ({ navigation }) => {
    const currentUser = useAppStore((s) => s.currentUser);
    const chats = useAppStore((s) => s.chats);
    const providers = useAppStore((s) => s.providers);
    const subscriptions = useAppStore((s) => s.subscriptions);

    const [search, setSearch] = React.useState('');
    const [filter, setFilter] = React.useState<ChatFilter>('all');

    const activeProviderIds = currentUser
        ? subscriptions
            .filter((s) => s.clientId === currentUser.id && s.status === 'active')
            .map((s) => s.providerId)
        : [];

    const filteredChats = chats
        .filter((chat) => {
            if (filter === 'subscribed') {
                return activeProviderIds.includes(chat.providerId);
            }
            if (filter === 'not_subscribed') {
                return !activeProviderIds.includes(chat.providerId);
            }
            return true;
        })
        .filter((chat) => {
            if (!search.trim()) return true;
            const provider = providers.find((p) => p.id === chat.providerId);
            const name = provider?.fullName.toLowerCase() ?? '';
            return name.includes(search.toLowerCase());
        });

    const handleOpenChat = (chatId: string) => {
        navigation.navigate('SingleChat', { chatId });
    };

    const renderChatItem = ({ item }: any) => {
        const provider = providers.find((p) => p.id === item.providerId);
        const isSubscribed = activeProviderIds.includes(item.providerId);

        return (
            <TouchableOpacity onPress={() => handleOpenChat(item.id)}>
                <Card>
                    <View style={styles.chatRow}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.chatName}>
                                {provider?.fullName ?? 'Unknown'}
                            </Text>
                            <Text style={styles.chatLastMessage} numberOfLines={1}>
                                {item.lastMessage}
                            </Text>
                        </View>
                        {isSubscribed && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>Sub</Text>
                            </View>
                        )}
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <Screen title="Chats">
            {/* 1. Search bar */}
            <SectionHeader label="Search" />
            <TextInput
                style={styles.input}
                placeholder="Search by name"
                placeholderTextColor={COLORS.textSecondary}
                value={search}
                onChangeText={setSearch}
            />

            {/* 2. Tabs for filter */}
            <View style={styles.tabsRow}>
                <TabButton
                    label="All"
                    active={filter === 'all'}
                    onPress={() => setFilter('all')}
                />
                <TabButton
                    label="Subscribed"
                    active={filter === 'subscribed'}
                    onPress={() => setFilter('subscribed')}
                />
                <TabButton
                    label="Not subscribed"
                    active={filter === 'not_subscribed'}
                    onPress={() => setFilter('not_subscribed')}
                />
            </View>

            {/* 3. List of chats */}
            <SectionHeader label="Chats" />
            {filteredChats.length === 0 ? (
                <Text style={styles.textMuted}>No chats found.</Text>
            ) : (
                <FlatList
                    data={filteredChats}
                    keyExtractor={(item) => item.id}
                    renderItem={renderChatItem}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </Screen>
    );
};

const TabButton: React.FC<{
    label: string;
    active: boolean;
    onPress: () => void;
}> = ({ label, active, onPress }) => (
    <TouchableOpacity
        style={[
            styles.tabButton,
            active && {
                backgroundColor: COLORS.brand,
                borderColor: COLORS.brand,
            },
        ]}
        onPress={onPress}
    >
        <Text
            style={[
                styles.tabText,
                active && { color: COLORS.white, fontWeight: '600' },
            ]}
        >
            {label}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        marginBottom: SPACING.sm,
        fontSize: 14,
        color: COLORS.textPrimary,
        backgroundColor: COLORS.surface,
    },
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
    tabsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: SPACING.sm,
        width: '100%',
        columnGap: SPACING.sm,        // space between tabs
    },

    tabButton: {
        minWidth: 70,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.pill ?? 20,
        paddingHorizontal: SPACING.md + 2, // horizontal padding -> width = text + padding
        paddingVertical: SPACING.xs + 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.surface,
    },

    tabText: {
        ...TYPOGRAPHY.text,
        fontSize: 13,
        color: COLORS.textPrimary,
    },

    chatRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatName: {
        ...TYPOGRAPHY.subtitle,
        fontSize: 15,
        color: COLORS.textPrimary,
    },
    chatLastMessage: {
        ...TYPOGRAPHY.body,
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    badge: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.pill ?? 20,
        backgroundColor: COLORS.brand,
        marginLeft: SPACING.sm,
    },
    badgeText: {
        ...TYPOGRAPHY.text,
        fontSize: 11,
        color: COLORS.white,
    },
});
