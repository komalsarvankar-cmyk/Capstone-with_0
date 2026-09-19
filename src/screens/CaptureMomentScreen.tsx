import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Image as RNImage, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Camera, Image as ImageIcon } from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import { attachMomentPhoto, saveMoment } from '@/lib/memories';
import { useConnectedFriend } from '@/lib/useConnectedFriend';
import { colors, fonts, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'CaptureMoment'>;

type CaptureState = 'picking' | 'uploading' | 'upload-failed' | 'success';

/** Ported from the original prototype's CaptureMomentScreen (git show cfaa64e:src/components/CaptureMomentScreen.tsx). */
export function CaptureMomentScreen({ route, navigation }: Props) {
  const { activityTitle, emotion } = route.params;
  const friendUid = useConnectedFriend();
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [state, setState] = useState<CaptureState>('picking');
  const [error, setError] = useState<string | null>(null);
  const [savedMemoryId, setSavedMemoryId] = useState<string | null>(null);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) setLocalUri(result.assets[0].uri);
  };

  const handleSkip = () => navigation.navigate('Main');

  const handleSave = async () => {
    if (!friendUid) return;
    setState('uploading');
    setError(null);
    try {
      const memoryId = savedMemoryId ?? (await saveMoment(friendUid, activityTitle, emotion, { note: note || undefined }));
      setSavedMemoryId(memoryId);
      if (localUri) await attachMomentPhoto(memoryId, localUri);
      setState('success');
      navigation.navigate('SharedMoment', { memoryId });
    } catch (err) {
      setState('upload-failed');
      setError(err instanceof Error ? err.message : 'Upload failed.');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.nav}>
        <View style={styles.pill}>
          <Text style={styles.pillText}>Optional Memory</Text>
        </View>
        <Pressable onPress={handleSkip}>
          <Text style={styles.skipTopText}>Skip</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headlineBlock}>
          <Text style={styles.headline}>Keep a little of this moment?</Text>
          <Text style={styles.subtitle}>What do you want to remember?</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionLabelRow}>
            <Camera size={14} color={colors.lavender600} />
            <Text style={styles.sectionLabelText}>Photo</Text>
            {localUri ? (
              <Pressable onPress={() => setLocalUri(null)} style={styles.removePhotoButton}>
                <Text style={styles.removePhotoText}>Remove photo</Text>
              </Pressable>
            ) : null}
          </View>

          {localUri ? (
            <View style={styles.photoPreviewWrap}>
              <RNImage source={{ uri: localUri }} style={styles.photoPreview} />
              <View style={styles.photoBadge}>
                <Text style={styles.photoBadgeText}>Photo attached</Text>
              </View>
            </View>
          ) : (
            <Pressable style={styles.photoDropzone} onPress={pickPhoto}>
              <ImageIcon size={20} color={colors.lavender600} />
              <Text style={styles.photoDropzoneText}>Tap to select a photo</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabelText}>Short note</Text>
          <TextInput
            placeholder="A line about what happened, something funny said, or how it felt..."
            placeholderTextColor="#9CA3AF"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
            style={styles.noteInput}
          />
        </View>

        {state === 'upload-failed' && error ? <Text style={styles.error}>{error}</Text> : null}
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={[styles.saveButton, state === 'uploading' && styles.disabled]} onPress={handleSave} disabled={state === 'uploading'}>
          <Text style={styles.saveButtonText}>
            {state === 'uploading' ? 'Saving...' : state === 'upload-failed' ? 'Retry' : 'Save our moment'}
          </Text>
        </Pressable>
        <Pressable style={styles.skipBottomButton} onPress={handleSkip}>
          <Text style={styles.skipBottomText}>Skip</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas, justifyContent: 'space-between' },
  nav: { height: 52, paddingHorizontal: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.lavender100 },
  pillText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender600 },
  skipTopText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.textSecondary },

  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, gap: spacing.md },
  headlineBlock: { gap: 4 },
  headline: { fontFamily: fonts.serif, fontSize: 28, lineHeight: 33, color: colors.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontFamily: fonts.sans, fontSize: 13.5, lineHeight: 19, color: colors.textSecondary },

  section: { gap: 8 },
  sectionLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  sectionLabelText: { fontFamily: fonts.sansSemiBold, fontSize: 13, color: colors.textPrimary, flex: 1 },
  removePhotoButton: {},
  removePhotoText: { fontFamily: fonts.sans, fontSize: 11, color: '#DC2626' },

  photoDropzone: {
    height: 90,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.lavender200,
    backgroundColor: colors.lavender50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  photoDropzoneText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender600 },
  photoPreviewWrap: { height: 140, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  photoPreview: { width: '100%', height: '100%' },
  photoBadge: { position: 'absolute', bottom: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  photoBadgeText: { fontFamily: fonts.sans, fontSize: 11, color: '#fff' },

  noteInput: {
    minHeight: 76,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    fontFamily: fonts.sans,
    fontSize: 13.5,
    lineHeight: 19,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  error: { fontFamily: fonts.sans, fontSize: 13, color: '#B91C1C' },

  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md, alignItems: 'center', gap: 6 },
  saveButton: { width: '100%', height: 52, borderRadius: radii.pill, backgroundColor: colors.lavender600, alignItems: 'center', justifyContent: 'center' },
  saveButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 16, color: '#fff' },
  disabled: { opacity: 0.6 },
  skipBottomButton: { paddingVertical: 6 },
  skipBottomText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.textSecondary },
});
