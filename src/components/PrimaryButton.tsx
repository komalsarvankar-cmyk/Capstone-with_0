import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, radii } from '@/theme';

/** Sizing/typography ported from the original's `h-[52px] rounded-full ... font-sans font-semibold text-[16px]` button. */
export function PrimaryButton({
  label,
  onPress,
  loading,
  disabled,
  variant = 'primary',
}: {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled || loading }}
      hitSlop={8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.lavender600} />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'secondary' && styles.secondaryLabel,
            variant === 'ghost' && styles.ghostLabel,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: colors.lavender600,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  secondary: { backgroundColor: colors.lavender100, shadowOpacity: 0 },
  ghost: { backgroundColor: 'transparent', height: 'auto', paddingVertical: 8, shadowOpacity: 0 },
  disabled: { opacity: 0.5 },
  pressed: { opacity: 0.85 },
  label: { color: '#fff', fontFamily: fonts.sansSemiBold, fontSize: 16 },
  secondaryLabel: { color: colors.lavender700 },
  ghostLabel: { color: colors.textSecondary, fontFamily: fonts.sansMedium, fontSize: 14 },
});
