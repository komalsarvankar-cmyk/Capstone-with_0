import React from 'react';
import { Text, View } from 'react-native';
import { colors, fonts } from '@/theme';

/** Ported from the original prototype's brand mark: `With<span class="text-lavender-600">.</span>` in Literata italic. */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Text style={{ fontFamily: fonts.serifItalic, fontSize: size, color: colors.textPrimary, letterSpacing: -0.5 }}>
        With
      </Text>
      <Text style={{ fontFamily: fonts.serifItalic, fontSize: size, color: colors.lavender600 }}>.</Text>
    </View>
  );
}
