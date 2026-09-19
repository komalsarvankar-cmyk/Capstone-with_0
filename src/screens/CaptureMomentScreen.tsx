import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { Image, Text, TextInput, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PrimaryButton } from '@/components/PrimaryButton';
import type { RootStackParamList } from '@/navigation/types';
import { attachMomentPhoto, saveMoment } from '@/lib/memories';
import { useConnectedFriend } from '@/lib/useConnectedFriend';

type Props = NativeStackScreenProps<RootStackParamList, 'CaptureMoment'>;

type CaptureState = 'picking' | 'uploading' | 'upload-failed' | 'success';

export function CaptureMomentScreen({ navigation }: Props) {
  const friendUid = useConnectedFriend();
  const [localUri, setLocalUri] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [state, setState] = useState<CaptureState>('picking');
  const [error, setError] = useState<string | null>(null);

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.7 });
    if (!result.canceled) setLocalUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (!friendUid) return;
    setState('uploading');
    setError(null);
    try {
      const memoryId = await saveMoment(friendUid, 'Activity', 'calming', { note: note || undefined });
      if (localUri) await attachMomentPhoto(memoryId, localUri);
      setState('success');
      navigation.navigate('SharedMoment', { memoryId });
    } catch (err) {
      setState('upload-failed');
      setError(err instanceof Error ? err.message : 'Upload failed.');
    }
  };

  return (
    <Screen title="Capture the moment" subtitle="Optional photo and note.">
      <View style={{ gap: 12 }}>
        {localUri ? <Image source={{ uri: localUri }} style={{ width: '100%', height: 200, borderRadius: 16 }} /> : null}
        <PrimaryButton label="Add a photo" variant="secondary" onPress={pickPhoto} />
        <TextInput
          placeholder="Add a note"
          value={note}
          onChangeText={setNote}
          style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 12 }}
        />
        {state === 'upload-failed' && error ? (
          <View style={{ gap: 8 }}>
            <Text style={{ color: '#B91C1C' }}>{error}</Text>
            <PrimaryButton label="Retry" onPress={handleSave} />
          </View>
        ) : (
          <PrimaryButton label="Save to Our Story" onPress={handleSave} loading={state === 'uploading'} />
        )}
        <PrimaryButton label="Skip" variant="secondary" onPress={() => navigation.navigate('Main')} />
      </View>
    </Screen>
  );
}
