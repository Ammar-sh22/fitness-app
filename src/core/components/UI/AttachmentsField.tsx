// src/core/components/UI/AttachmentsField.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../../theme';

export type Attachment = {
  id: string;
  name: string;
  uri?: string;
  size?: number; // bytes
  type?: 'file' | 'image';
};

export type AttachmentsVariant =
  | 'field'   // register form: full-width field
  | 'icon'    // chat: small icon button like WhatsApp
  | 'plus';   // profile: big (+) button

type AttachmentsFieldProps = {
  label?: string;
  value: Attachment[];
  onChange: (next: Attachment[]) => void;

  // behavior
  onPick?: () => Promise<Attachment | Attachment[] | null>; // you will pass DocumentPicker / ImagePicker
  maxFileSizeBytes?: number; // e.g. 5 * 1024 * 1024
  variant?: AttachmentsVariant;

  // styling overrides
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  triggerStyle?: ViewStyle;
  triggerTextStyle?: TextStyle;
  chipStyle?: ViewStyle;
  chipTextStyle?: TextStyle;
};

export const AttachmentsField: React.FC<AttachmentsFieldProps> = ({
  label = 'Attachments',
  value,
  onChange,
  onPick,
  maxFileSizeBytes,
  variant = 'field',
  containerStyle,
  labelStyle,
  triggerStyle,
  triggerTextStyle,
  chipStyle,
  chipTextStyle,
}) => {
  const handleAdd = async () => {
    if (!onPick) return;

    const result = await onPick();
    if (!result) return;

    const items = Array.isArray(result) ? result : [result];

    const filtered = items.filter((att) => {
      if (!maxFileSizeBytes || !att.size) return true;
      return att.size <= maxFileSizeBytes;
    });

    const next = [...value, ...filtered];
    onChange(next);
  };

  const handleRemove = (id: string) => {
    onChange(value.filter((a) => a.id !== id));
  };

  const renderTrigger = () => {
    if (variant === 'icon') {
      // chat: small round icon button
      return (
        <TouchableOpacity
          style={[styles.iconButton, triggerStyle]}
          onPress={handleAdd}
        >
          <Text style={[styles.iconButtonText, triggerTextStyle]}>📎</Text>
        </TouchableOpacity>
      );
    }

    if (variant === 'plus') {
      // profile: big plus card
      return (
        <TouchableOpacity
          style={[styles.plusButton, triggerStyle]}
          onPress={handleAdd}
        >
          <Text style={[styles.plusButtonText, triggerTextStyle]}>+</Text>
        </TouchableOpacity>
      );
    }

    // default: field button (register form)
    return (
      <TouchableOpacity
        style={[styles.addButton, triggerStyle]}
        onPress={handleAdd}
      >
        <Text style={[styles.addButtonText, triggerTextStyle]}>
          + Attach
        </Text>
      </TouchableOpacity>
    );
  };

  const showLabel = variant !== 'icon';

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {showLabel && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}

      <View style={styles.row}>
        {renderTrigger()}

        {variant !== 'icon' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipsRow}
          >
            {value.map((att) => (
              <View key={att.id} style={[styles.chip, chipStyle]}>
                <Text
                  style={[styles.chipText, chipTextStyle]}
                  numberOfLines={1}
                >
                  {att.name}
                </Text>
                <Text
                  style={styles.chipRemove}
                  onPress={() => handleRemove(att.id)}
                >
                  ×
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  label: {
    ...TYPOGRAPHY.label,
    marginBottom: SPACING.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.brand,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.brandSoft,
  },
  addButtonText: {
    fontSize: 13,
    color: COLORS.brand,
    fontWeight: '600',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  iconButtonText: {
    fontSize: 18,
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    marginRight: SPACING.sm,
  },
  plusButtonText: {
    fontSize: 32,
    color: COLORS.brand,
    fontWeight: '600',
  },
  chipsRow: {
    paddingRight: SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.pill ?? 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.xs,
    maxWidth: 160,
  },
  chipText: {
    fontSize: 12,
    color: COLORS.textPrimary,
    flexShrink: 1,
  },
  chipRemove: {
    marginLeft: 4,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
