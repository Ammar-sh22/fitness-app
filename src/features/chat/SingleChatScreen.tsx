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
import { COLORS, TYPOGRAPHY, SPACING } from '../../core/theme';
import * as ImagePicker from 'expo-image-picker';
import {
    AttachmentsField,
    Attachment,
} from '../../core/components/UI/AttachmentsField';
import { ImagePreview } from '../../core/components/UI/ImagePreview';

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
            <Screen>
                <Text style={styles.textMuted}>Chat not found.</Text>
            </Screen>
        );
    }

    const senderId = currentUser?.id ?? 'demo_client';
    const provider = providers.find((p) => p.id === chat.providerId);

    const chatMessages = messages
        .filter((m) => m.chatId === chat.id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

    const [text, setText] = React.useState('');
    const [pendingImages, setPendingImages] = React.useState<Attachment[]>([]);

    const handlePickImages = async () => {
        const res = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 0.8,
        });

        if (res.canceled) return null;

        const items: Attachment[] = res.assets.map((a, index) => ({
            id: `${Date.now()}-${index}`,
            name: a.fileName ?? 'image.jpg',
            uri: a.uri,
            size: a.fileSize ?? undefined,
            type: 'image',
        }));

        return items;
    };

    const handleSend = () => {
        const trimmed = text.trim();
        const hasImages = pendingImages.length > 0;

        if (!trimmed && !hasImages) return;

        // send one message for text (if any)
        if (trimmed) {
            addMessage(chat.id, senderId, trimmed, undefined);
        }

        // send one message per image so each is visible in chat
        pendingImages.forEach((img) => {
            if (img.uri) {
                addMessage(chat.id, senderId, '', img.uri);
            }
        });

        setText('');
        setPendingImages([]);
    };

    const renderMessage = ({ item }: any) => {
        const isMe = item.senderId === senderId;
        const isImage = !!item.imageUri;
        const hasText = !!item.text && item.text !== '[image]';

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
                    {isImage && item.imageUri ? (
                        <ImagePreview
                            images={[{ id: item.id, uri: item.imageUri }]}
                        />
                    ) : null}

                    {hasText && <Text style={styles.messageText}>{item.text}</Text>}
                </View>
            </View>
        );
    };

    const renderPendingImages = () => {
        if (pendingImages.length === 0) return null;

        const handleRemoveImage = (id: string) => {
            setPendingImages((prev) => prev.filter((img) => img.id !== id));
        };

        return (
            <View style={styles.previewRow}>
                <ImagePreview
                    images={pendingImages
                        .filter((a) => !!a.uri)
                        .map((a) => ({ id: a.id, uri: a.uri as string }))}
                    onRemove={handleRemoveImage}
                />
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
            <Screen title={provider?.fullName ?? 'Chat'} style={{ backgroundColor: COLORS.background }} >
                <FlatList
                    data={chatMessages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messagesContainer}
                />

                {renderPendingImages()}

                <View style={styles.inputRow}>
                    {/* Text input (80%) + attach icon (right side) */}
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message"
                            placeholderTextColor={COLORS.textSecondary}
                            value={text}
                            onChangeText={setText}
                            multiline
                        />
                        <AttachmentsField
                            value={pendingImages}
                            onChange={setPendingImages}
                            onPick={handlePickImages}
                            variant="icon"
                            containerStyle={styles.attachContainer}
                        />
                    </View>

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
        backgroundColor: COLORS.background,
    },
    textMuted: {
        ...TYPOGRAPHY.label,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    messagesContainer: {
        paddingVertical: SPACING.xl,
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
        maxWidth: '100%',
        paddingHorizontal: 5,
        paddingVertical: 6,
        borderRadius: 16,
    },
    bubbleMe: {
        backgroundColor: COLORS.brandSoft,
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
    inputWrapper: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.surface,
        paddingHorizontal: 2,
        paddingVertical: 2,
        marginRight: SPACING.xs,
        height: 50,
        width: '100%',
    },
    input: {
        flex: 1,
        paddingHorizontal: SPACING.xs,
        paddingVertical: 6,
        fontSize: 12,
        color: COLORS.textPrimary,
        maxWidth: '80%',
    },
    attachContainer: {
        flex: 1,
        alignItems: 'flex-end',
        marginLeft: 1,
        marginTop: 0,
        marginBottom: 0,
        marginRight: 0,
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
    previewRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.sm,
        paddingBottom: SPACING.xs,
    },
});

