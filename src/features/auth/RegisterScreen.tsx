// src/features/auth/RegisterScreen.tsx
import React from 'react';
import {
    Text,
    TextInput,
    StyleSheet,
    View,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { string, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    AttachmentsField,
    Attachment,
} from '../../core/components/UI/AttachmentsField';
import { Screen } from '../../core/components/Layout/Screen';
import { ButtonPrimary } from '../../core/components/UI/Button';
import { useAppStore, UserRole } from '../../store/appStore';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../core/theme';
import * as DocumentPicker from 'expo-document-picker';


const registerSchema = z.object({
    fullName: z.string().min(2, 'Name is too short'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Min 6 characters'),
    phone: z.string().optional(),
    age: z.string().optional(),
    title: z.string().optional(),
    yearsOfExperience: z.string().optional(),
    languages: z.string().optional(),
    specialties: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterScreenProps = {
    navigation: any;
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
    navigation,
}) => {
    const setCurrentUser = useAppStore((s) => s.setCurrentUser);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValues>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            phone: '',
            age: '',
            title: '',
            yearsOfExperience: '',
            languages: '',
            specialties: '',
        },
        resolver: zodResolver(registerSchema),
    });

    const [selectedRole, setSelectedRole] =
        React.useState<UserRole | null>(null);
    const [roleError, setRoleError] = React.useState<string | null>(null);

    const isProvider =
        selectedRole === 'coach' || selectedRole === 'nutritionist';

    // refs for focusing next field
    const emailRef = React.useRef<TextInput | null>(null);
    const passwordRef = React.useRef<TextInput | null>(null);
    const phoneRef = React.useRef<TextInput | null>(null);
    const ageRef = React.useRef<TextInput | null>(null);
    const titleRef = React.useRef<TextInput | null>(null);
    const yearsRef = React.useRef<TextInput | null>(null);
    const languagesRef = React.useRef<TextInput | null>(null);
    const specialtiesRef = React.useRef<TextInput | null>(null);

    const [attachments, setAttachments] = React.useState<Attachment[]>([]);
    const LANGUAGE_OPTIONS = ['EN', 'AR', 'FR', 'DE'];

    const handlePickFiles = async (): Promise<Attachment[]> => {
        const res = await DocumentPicker.getDocumentAsync({
            multiple: true,
            copyToCacheDirectory: true,
        }); // [web:101][web:113]

        if (res.canceled) return [];

        const tooBig = res.assets.some(
            (a) => a.size && a.size > MAX_FILE_SIZE
        );
        if (tooBig) {
            Alert.alert('File too large', 'Each file must be 5 MB or less.');
        }

        const picked: Attachment[] = res.assets
            .filter((a) => !a.size || a.size <= MAX_FILE_SIZE)
            .map((a, index) => ({
                id: `${Date.now()}-${index}`,
                name: a.name ?? 'file',
                uri: a.uri,
                size: a.size ?? undefined,
                type: 'file',
            }));

        setAttachments((prev) => [...prev, ...picked]);
        return picked;
    };




    const onSubmit = (data: RegisterFormValues) => {
        if (!selectedRole) {
            setRoleError('Please choose your role.');
            return;
        }

        setRoleError(null);

        const userRole = selectedRole as UserRole;

        const currentUser = {
            id: String(Date.now()),
            role: userRole,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone || undefined,
            age: data.age ? Number(data.age) : undefined,
            title: data.title || undefined,
            yearsOfExperience: data.yearsOfExperience
                ? String(data.yearsOfExperience)
                : undefined,
            languages: data.languages
                ? data.languages.split(',').map((l) => l.trim())
                : undefined,
            specialties: data.specialties
                ? data.specialties.split(',').map((s) => s.trim())
                : undefined,
            attachments, // now included in user object
        };

        // IMPORTANT: no navigation.replace('MainTabs') here
        setCurrentUser(currentUser);
    };

    return (
        <Screen title="Sign up" showHeader={false}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator
                >
                    <Image
                        source={require('../../core/components/Icons/3ashlogo1.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />

                    <Text style={styles.textMuted}>
                        Enter your info and choose your role. Extra fields appear for Coach /
                        Nutritionist.
                    </Text>

                    {/* Name */}
                    <Controller
                        control={control}
                        name="fullName"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                style={styles.input}
                                placeholder="Full name"
                                placeholderTextColor={COLORS.textSecondary}
                                value={value}
                                onChangeText={onChange}
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => emailRef.current?.focus()}
                            />
                        )}
                    />
                    {errors.fullName && (
                        <Text style={styles.errorText}>{errors.fullName.message}</Text>
                    )}

                    {/* Email */}
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                ref={emailRef}
                                style={styles.input}
                                placeholder="Email"
                                placeholderTextColor={COLORS.textSecondary}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={value}
                                onChangeText={onChange}
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => passwordRef.current?.focus()}
                            />
                        )}
                    />
                    {errors.email && (
                        <Text style={styles.errorText}>{errors.email.message}</Text>
                    )}

                    {/* Password */}
                    <Controller
                        control={control}
                        name="password"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                ref={passwordRef}
                                style={styles.input}
                                placeholder="Password"
                                placeholderTextColor={COLORS.textSecondary}
                                secureTextEntry
                                value={value}
                                onChangeText={onChange}
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => phoneRef.current?.focus()}
                            />
                        )}
                    />
                    {errors.password && (
                        <Text style={styles.errorText}>{errors.password.message}</Text>
                    )}

                    {/* Phone */}
                    <Controller
                        control={control}
                        name="phone"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                ref={phoneRef}
                                style={styles.input}
                                placeholder="Phone"
                                placeholderTextColor={COLORS.textSecondary}
                                keyboardType="phone-pad"
                                value={value}
                                onChangeText={onChange}
                                returnKeyType="next"
                                blurOnSubmit={false}
                                onSubmitEditing={() => ageRef.current?.focus()}
                            />
                        )}
                    />

                    {/* Age */}
                    <Controller
                        control={control}
                        name="age"
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                ref={ageRef}
                                style={styles.input}
                                placeholder="Age"
                                placeholderTextColor={COLORS.textSecondary}
                                keyboardType="numeric"
                                value={value}
                                onChangeText={onChange}
                                returnKeyType={isProvider ? 'next' : 'done'}
                                blurOnSubmit={!isProvider}
                                onSubmitEditing={() =>
                                    isProvider ? titleRef.current?.focus() : undefined
                                }
                            />
                        )}
                    />

                    {/* Role selection */}
                    <View style={styles.roleRow}>
                        <RoleButton
                            label="Client"
                            selected={selectedRole === 'client'}
                            onPress={() => {
                                setSelectedRole('client');
                                setRoleError(null);
                            }}
                        />
                        <RoleButton
                            label="Coach"
                            selected={selectedRole === 'coach'}
                            onPress={() => {
                                setSelectedRole('coach');
                                setRoleError(null);
                            }}
                        />
                        <RoleButton
                            label="sports nutritionist"
                            selected={selectedRole === 'nutritionist'}
                            onPress={() => {
                                setSelectedRole('nutritionist');
                                setRoleError(null);
                            }}
                        />
                    </View>

                    {roleError && <Text style={styles.errorText}>{roleError}</Text>}

                    {/* Extra fields for providers */}
                    {isProvider && (
                        <>
                            <Controller
                                control={control}
                                name="yearsOfExperience"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        ref={yearsRef}
                                        style={styles.input}
                                        placeholder="period of experience"
                                        placeholderTextColor={COLORS.textSecondary}
                                        value={value}
                                        onChangeText={onChange}
                                        returnKeyType="next"
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => languagesRef.current?.focus()}
                                    />
                                )}
                            />

                            <Controller
                                control={control}
                                name="languages"
                                render={({ field: { onChange, value } }) => {
                                    const [open, setOpen] = React.useState(false);
                                    const selected = value
                                        ? value.split(',').map((v) => v.trim())
                                        : [];

                                    const toggleLang = (code: string) => {
                                        const next = selected.includes(code)
                                            ? selected.filter((c) => c !== code)
                                            : [...selected, code];
                                        onChange(next.join(', '));
                                    };

                                    const label =
                                        selected.length === 0
                                            ? 'Select languages'
                                            : selected.join(', ');

                                    return (
                                        <View style={styles.dropdownWrapper}>
                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={() => setOpen((v) => !v)}
                                                style={styles.dropdownInput}
                                            >
                                                <Text style={styles.dropdownLabel} numberOfLines={1}>
                                                    {label}
                                                </Text>
                                                <Text style={styles.dropdownArrow}>
                                                    {open ? '▲' : '▼'}
                                                </Text>
                                            </TouchableOpacity>

                                            {open && (
                                                <View style={styles.dropdownMenu}>
                                                    {LANGUAGE_OPTIONS.map((code) => {
                                                        const isActive = selected.includes(code);
                                                        return (
                                                            <TouchableOpacity
                                                                key={code}
                                                                onPress={() => toggleLang(code)}
                                                                style={[
                                                                    styles.dropdownItem,
                                                                    isActive && styles.dropdownItemActive,
                                                                ]}
                                                            >
                                                                <Text
                                                                    style={[
                                                                        styles.dropdownItemText,
                                                                        isActive && styles.dropdownItemTextActive,
                                                                    ]}
                                                                >
                                                                    {code}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                        </View>
                                    );
                                }}
                            />

                            {/* Attachments field for providers */}
                            <AttachmentsField
                                label="Certificates / documents"
                                value={attachments}
                                onChange={setAttachments}
                                onPick={handlePickFiles}
                                maxFileSizeBytes={MAX_FILE_SIZE}
                                variant="field"
                            />



                            <Controller
                                control={control}
                                name="specialties"
                                render={({ field: { onChange, value } }) => (
                                    <TextInput
                                        ref={specialtiesRef}
                                        style={styles.input}
                                        placeholder="Specialties (e.g. weight loss, fitness)"
                                        placeholderTextColor={COLORS.textSecondary}
                                        value={value}
                                        onChangeText={onChange}
                                        returnKeyType="done"
                                        onSubmitEditing={handleSubmit(onSubmit)}
                                    />
                                )}
                            />
                        </>
                    )}

                    <View style={styles.buttonsWrapper}>
                        <View style={styles.button}>
                            <ButtonPrimary label="Sign up" onPress={handleSubmit(onSubmit)} />
                        </View>
                        <View style={styles.button}>
                            <ButtonPrimary
                                label="Back to login"
                                onPress={() => navigation.goBack()}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Screen>
    );
};

type RoleButtonProps = {
    label: string;
    selected: boolean;
    onPress: () => void;
};

const RoleButton: React.FC<RoleButtonProps> = ({
    label,
    selected,
    onPress,
}) => (
    <Text
        onPress={onPress}
        style={[styles.roleButton, selected && styles.roleButtonSelected]}
    >
        <Text style={styles.roleButtonText}>{label}</Text>
    </Text>
);

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: SPACING.sm,
        paddingBottom: SPACING.lg,
        paddingTop: SPACING.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 140,
        height: 80,
        marginBottom: SPACING.lg,
    },
    textMuted: {
        ...TYPOGRAPHY.label,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
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
    errorText: {
        width: '100%',
        fontSize: 12,
        color: COLORS.danger,
        marginBottom: SPACING.xs,
    },
    roleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
        width: '100%',
    },
    roleButton: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.md,
        marginHorizontal: 2,
        backgroundColor: COLORS.surface,
    },
    roleButtonText: {
        textAlign: 'center',
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    roleButtonSelected: {
        borderColor: COLORS.brand,
        backgroundColor: COLORS.brandSoft,
        color: COLORS.black,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonsWrapper: {
        width: '100%',
        marginTop: SPACING.lg,
    },
    button: {
        marginBottom: SPACING.sm,
    },
    dropdownWrapper: {
        width: '100%',
        marginBottom: SPACING.sm,
    },
    dropdownInput: {
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm + 2,
        backgroundColor: COLORS.surface,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownLabel: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    dropdownArrow: {
        marginLeft: SPACING.xs,
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    dropdownMenu: {
        marginTop: 4,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.md,
        backgroundColor: COLORS.surface,
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
    },
    dropdownItemActive: {
        backgroundColor: COLORS.brandSoft,
    },
    dropdownItemText: {
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    dropdownItemTextActive: {
        color: COLORS.black,
    },
});
