// src/features/profile/ProfileScreen.tsx
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Screen } from '../../core/components/Layout/Screen';
import { SectionHeader } from '../../core/components/UI/SectionHeader';
import { Card } from '../../core/components/UI/Card';
import { useAppStore } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../core/theme';
import * as ImagePicker from 'expo-image-picker';
import {
    AttachmentsField,
    Attachment,
} from '../../core/components/UI/AttachmentsField';
import { ImagePreview } from '../../core/components/UI/ImagePreview';

type ProfileScreenProps = {
    navigation: any;
};

/* Simple fallback Profile (unused, real one is from features/profile) */
export const FallbackProfileScreen: React.FC = () => {
    const currentUser = useAppStore((s) => s.currentUser);

    return (
        <Screen title="Profile">
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <SectionHeader label="Basic information" />
                <Card>
                    <Text style={styles.cardTitle}>Full name</Text>
                    <Text style={styles.cardSubtitle}>
                        {currentUser?.fullName ?? '[not set]'}
                    </Text>

                    <Text style={[styles.cardTitle, { marginTop: SPACING.sm }]}>
                        Role
                    </Text>
                    <Text style={styles.cardSubtitle}>
                        {currentUser?.role ?? 'Guest'}
                    </Text>
                </Card>
            </ScrollView>
        </Screen>
    );
};

const handlePickProfileImages = async () => {
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

export const ProfileScreen: React.FC<ProfileScreenProps> = () => {
    const currentUser = useAppStore((s) => s.currentUser);
    const [attachments, setAttachments] = React.useState<Attachment[]>([]);

    const handleRemoveImage = (id: string) => {
        // useState with functional update to keep state safe
        setAttachments((prev) => prev.filter((a) => a.id !== id));
    };

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
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
        >
            <Screen title="Profile">
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* 1. Hero card with outer shadow */}
                    <View style={styles.heroCardShadow}>
                        <Card>
                            <View style={styles.heroHeader}>
                                <View style={styles.avatarCircle} />
                                <View style={styles.heroText}>
                                    <Text style={styles.heroName}>{currentUser.fullName}</Text>
                                    <Text style={styles.heroRole}>
                                        {currentUser.role === 'client'
                                            ? 'Client'
                                            : currentUser.role === 'coach'
                                                ? 'Coach'
                                                : 'Sports nutritionist'}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.heroMetaRow}>
                                {currentUser.age !== undefined && (
                                    <View style={styles.heroMetaItem}>
                                        <Text style={styles.heroMetaLabel}>Age</Text>
                                        <Text style={styles.heroMetaValue}>{currentUser.age}</Text>
                                    </View>
                                )}
                                {currentUser.phone && (
                                    <View style={styles.heroMetaItem}>
                                        <Text style={styles.heroMetaLabel}>Phone</Text>
                                        <Text style={styles.heroMetaValue}>
                                            {currentUser.phone}
                                        </Text>
                                    </View>
                                )}
                                <View style={styles.heroMetaItem}>
                                    <Text style={styles.heroMetaLabel}>Experience</Text>
                                    <Text style={styles.heroMetaValue} numberOfLines={1}>
                                        {currentUser.yearsOfExperience || 'N/A'}
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    </View>

                    {/* 2. About card (provider extra info) */}
                    {isProvider && (
                        <>
                            <SectionHeader label="About" />
                            <Card>
                                <Row label="Email" value={currentUser.email} />
                                <Row
                                    label="Languages"
                                    value={currentUser.languages?.join(', ')}
                                />
                                <Row
                                    label="Specialties"
                                    value={currentUser.specialties?.join(', ')}
                                />
                            </Card>
                        </>
                    )}

                    {/* 3. Attachments row + card */}
                    {isProvider && (
                        <>
                            <View style={styles.attachmentsHeaderRow}>
                                <SectionHeader label="Attachments" />
                                <AttachmentsField
                                    label=""
                                    value={attachments}
                                    onChange={setAttachments}
                                    onPick={handlePickProfileImages}
                                    variant="plus"
                                    containerStyle={styles.attachmentIcon}
                                />
                            </View>
                            <Card>
                                {attachments.length === 0 ? (
                                    <Text style={styles.textMuted}>
                                        Here you can upload your images (certificates,
                                        transformations, etc.).
                                    </Text>
                                ) : (
                                    <View style={styles.attachmentsList}>
                                        {/* image preview + full-screen viewer */}
                                        <ImagePreview
                                            images={attachments
                                                .filter((a) => !!a.uri)
                                                .map((a) => ({ id: a.id, uri: a.uri as string }))}
                                            onRemove={handleRemoveImage}
                                        />
                                    </View>
                                )}
                            </Card>
                        </>
                    )}

                    {/* 4. Posts (providers only) */}
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
                </ScrollView>
            </Screen>
        </KeyboardAvoidingView>
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
    flex: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 2,
        paddingBottom: SPACING.lg,
        paddingTop: SPACING.md,
        rowGap: SPACING.xs,
    },
    textMuted: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
    },

    /* Hero card */
    heroCardShadow: {
        paddingVertical: 20,
        paddingHorizontal: 3,
        borderRadius: RADIUS.lg,
    },
    heroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    avatarCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.brandSoft,
        marginRight: SPACING.md,
    },
    heroText: {
        flex: 1,
    },
    heroName: {
        ...TYPOGRAPHY.title,
        fontSize: 20,
        color: COLORS.textPrimary,
    },
    heroRole: {
        ...TYPOGRAPHY.text,
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    heroMetaRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: SPACING.xs,
        paddingLeft: SPACING.sm,
    },
    heroMetaItem: {
        marginRight: SPACING.lg,
        marginBottom: SPACING.xs,
    },
    heroMetaLabel: {
        ...TYPOGRAPHY.text,
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    heroMetaValue: {
        ...TYPOGRAPHY.body,
        fontSize: 14,
        color: COLORS.textPrimary,
    },

    /* Info rows */
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

    /* Attachments */
    attachmentsHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: SPACING.xl,
    },
    attachmentIcon: {
        flex: 1,
        alignItems: 'center',
        marginTop: -SPACING.sm,
    },
    attachmentsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.xs,
    },
    attachmentChip: {
        paddingHorizontal: SPACING.sm,
        paddingVertical: SPACING.xs,
        borderRadius: RADIUS.pill ?? 20,
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    attachmentText: {
        ...TYPOGRAPHY.text,
        fontSize: 12,
        color: COLORS.textPrimary,
    },

    /* Fallback card styles */
    cardTitle: {
        ...TYPOGRAPHY.subtitle,
        fontSize: 15,
        color: COLORS.textPrimary,
    },
    cardSubtitle: {
        ...TYPOGRAPHY.body,
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
});
