// src/features/chat/SingleChatScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Screen } from '../../core/components/Layout/Screen';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../core/theme';

type SingleChatScreenProps = {
    route: any;
};

export const SingleChatScreen: React.FC<SingleChatScreenProps> = ({
    route,
}) => {
    const { chatId } = route.params as { chatId: string };

    const currentUser = useAppStore((s) => s.currentUser);
    const chats = useAppStore((s) => s.chats);
    const messages = useAppStore((s) => s.messages);
    const providers = useAppStore((s) => s.providers);
    const addMessage = useAppStore((s) => s.addMessage);

    const chat = chats.find((c) => c.id === chatId);

    if (!chat) {
        return (
            <Screen title="Chat">
                <Text style={styles.textMuted}>Chat not found.</Text>
            </Screen>
        );
    }

    const senderId = currentUser?.id ?? 'democlient';
    const provider = providers.find((p) => p.id === chat.providerId);

    const chatMessages = messages
        .filter((m) => m.chatId === chat.id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    const [text, setText] = React.useState('');

    const handleSend = () => {
        const trimmed = text.trim();
        if (!trimmed) return;

        addMessage(chat.id, senderId, trimmed);
        setText('');
    };

    const renderMessage = ({ item }: any) => {
        const isMe = item.senderId === senderId;
        return (
            <View
                style={[
                    styles.messageRow,
                    isMe ? styles.messageRowMe : styles.messageRowOther,
                ]}
            >
                <View
                    style={[
                        styles.bubble,
                        isMe ? styles.bubbleMe : styles.bubbleOther,
                    ]}
                >
                    <Text style={styles.messageText}>{item.text}</Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            <Screen title={provider?.fullName ?? 'Chat'}>
                <FlatList
                    data={chatMessages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messagesContainer}
                />

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type a message"
                        placeholderTextColor={COLORS.textSecondary}
                        value={text}
                        onChangeText={setText}
                    />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </View>
            </Screen>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    textMuted: {
        ...TYPOGRAPHY.label,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    messagesContainer: {
        paddingVertical: SPACING.sm,
    },
    messageRow: {
        flexDirection: 'row',
        marginVertical: 2,
        paddingHorizontal: SPACING.sm,
    },
    messageRowMe: {
        justifyContent: 'flex-end',
    },
    messageRowOther: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '80%',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
    },
    bubbleMe: {
        backgroundColor: '#DCF8C6',
        borderBottomRightRadius: 2,
    },
    bubbleOther: {
        backgroundColor: COLORS.surface,
        borderBottomLeftRadius: 2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    messageText: {
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.sm,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        fontSize: 14,
        color: COLORS.textPrimary,
        marginRight: SPACING.sm,
        backgroundColor: COLORS.surface,
    },
    sendButton: {
        backgroundColor: COLORS.brand,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    sendButtonText: {
        color: COLORS.black,
        fontSize: 14,
        fontWeight: '600',
    },
});
