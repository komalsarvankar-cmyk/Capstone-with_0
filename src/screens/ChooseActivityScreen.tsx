import React, { useState } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  ChevronLeft,
  ArrowRight,
  Sparkles,
  Clock,
  X,
  Shuffle,
  Check,
  Footprints,
  Sunset,
  Utensils,
  Gamepad2,
  Music,
  Coffee,
  BookOpen,
  Compass,
  Camera,
  Bike,
  Palette,
} from 'lucide-react-native';
import type { RootStackParamList } from '@/navigation/types';
import type { Activity } from '@/types';
import { CURATED_ACTIVITIES } from '@/data';
import { fetchAiSuggestions, type ActivitySuggestion } from '@/lib/activities';
import { useConnectedFriend } from '@/lib/useConnectedFriend';
import { useFriendProfile } from '@/lib/useFriendProfile';
import { colors, fonts, radii, spacing } from '@/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ChooseActivity'>;

const TAG_FILTERS = ['All', 'Simple', 'Outdoors', 'Creative', 'Remote', 'Comforting'];
const TIME_OPTIONS = ['15-20 min', '30 min', '45-60 min'] as const;
const SETTING_OPTIONS = ['Outdoors', 'Indoors', 'Either'] as const;
const ENERGY_OPTIONS = ['Low / Chill', 'Active', 'Creative'] as const;

function getActivityIcon(iconName: string) {
  const props = { size: 18, color: colors.lavender600 };
  switch (iconName) {
    case 'walk':
      return <Footprints {...props} />;
    case 'sunset':
      return <Sunset {...props} color={colors.amber600} />;
    case 'utensils':
      return <Utensils {...props} color={colors.emerald600} />;
    case 'gamepad':
      return <Gamepad2 {...props} />;
    case 'music':
      return <Music {...props} color={colors.pink500} />;
    case 'coffee':
      return <Coffee {...props} color={colors.amber700} />;
    case 'book':
      return <BookOpen {...props} color={colors.indigo600} />;
    case 'compass':
      return <Compass {...props} color={colors.orange500} />;
    case 'camera':
      return <Camera {...props} />;
    case 'bike':
      return <Bike {...props} color={colors.emerald500} />;
    case 'palette':
      return <Palette {...props} color={colors.pink500} />;
    default:
      return <Sparkles {...props} />;
  }
}

/** Ported from the original prototype's ChooseActivityScreen (git show cfaa64e:src/components/ChooseActivityScreen.tsx). */
export function ChooseActivityScreen({ navigation }: Props) {
  const friendUid = useConnectedFriend();
  const friendName = useFriendProfile(friendUid) ?? 'your friend';
  const friendFirstName = friendName.split(' ')[0];

  const [showAllLibrary, setShowAllLibrary] = useState(false);
  const [selectedTagFilter, setSelectedTagFilter] = useState('All');
  const [showAiModal, setShowAiModal] = useState(false);

  const [aiTime, setAiTime] = useState<(typeof TIME_OPTIONS)[number]>('15-20 min');
  const [aiSetting, setAiSetting] = useState<(typeof SETTING_OPTIONS)[number]>('Outdoors');
  const [aiEnergy, setAiEnergy] = useState<(typeof ENERGY_OPTIONS)[number]>('Low / Chill');
  const [aiIdea, setAiIdea] = useState<ActivitySuggestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const primaryActivities = CURATED_ACTIVITIES.slice(0, 9);
  const filteredLibrary = CURATED_ACTIVITIES.filter(
    (activity) => selectedTagFilter === 'All' || activity.tags.includes(selectedTagFilter),
  );

  const handleSelectActivity = (activity: Activity) => {
    navigation.navigate('InviteFriend', { activity });
  };

  const handleGenerateAiIdea = async () => {
    setIsGenerating(true);
    try {
      const context = `Time available: ${aiTime}. Setting: ${aiSetting}. Energy: ${aiEnergy}.`;
      const results = await fetchAiSuggestions([context]);
      setAiIdea(results[0] ?? null);
    } catch {
      setAiIdea(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleOpenAiModal = () => {
    setShowAiModal(true);
    setAiIdea(null);
    handleGenerateAiIdea();
  };

  const handleAcceptAiIdea = () => {
    if (!aiIdea) return;
    setShowAiModal(false);
    handleSelectActivity({
      id: `ai-${Date.now()}`,
      title: aiIdea.title,
      duration: aiTime,
      description: aiIdea.description,
      iconName: 'sparkles',
      locationType: 'either',
      tags: ['AI Suggested'],
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.nav}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton} accessibilityLabel="Go back">
          <ChevronLeft size={22} color={colors.textSecondary} />
        </Pressable>
        <View style={styles.pill}>
          <Text style={styles.pillText}>With {friendFirstName}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headlineBlock}>
          <Text style={styles.headline}>What would you like to do together?</Text>
          <Text style={styles.subtitle}>Small, simple activities that fit into real life.</Text>
        </View>

        <View style={styles.aiCard}>
          <View style={styles.aiCardHeader}>
            <View style={styles.aiCardHeaderLeft}>
              <View style={styles.aiIconBadge}>
                <Sparkles size={15} color="#fff" />
              </View>
              <Text style={styles.aiCardTitle}>Can't decide?</Text>
            </View>
            <View style={styles.aiCardTag}>
              <Text style={styles.aiCardTagText}>Idea Generator</Text>
            </View>
          </View>
          <Text style={styles.aiCardBody}>
            Let With think of something for you two based on your time and mood.
          </Text>
          <Pressable style={styles.aiSuggestButton} onPress={handleOpenAiModal}>
            <Sparkles size={15} color="#fff" />
            <Text style={styles.aiSuggestButtonText}>Suggest something</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionLabel}>CURATED EVERYDAY ACTIVITIES</Text>
          <Text style={styles.sectionMeta}>Low effort</Text>
        </View>

        <View style={{ gap: spacing.sm }}>
          {primaryActivities.map((activity) => (
            <Pressable key={activity.id} style={styles.activityCard} onPress={() => handleSelectActivity(activity)}>
              <View style={styles.activityCardLeft}>
                <View style={styles.activityIconBox}>{getActivityIcon(activity.iconName)}</View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <View style={styles.activityMetaRow}>
                    <Clock size={12} color="#9CA3AF" />
                    <Text style={styles.activityMetaText}>{activity.duration}</Text>
                    <Text style={styles.activityMetaDot}>&bull;</Text>
                    <Text style={styles.activityMetaText} numberOfLines={1}>
                      {activity.tags[0]}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.activityArrow}>
                <ArrowRight size={14} color="#9CA3AF" />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.viewAllRow}>
          <Pressable style={styles.viewAllButton} onPress={() => setShowAllLibrary(true)}>
            <Text style={styles.viewAllButtonText}>View all activities &rarr;</Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal visible={showAllLibrary} animationType="slide" transparent onRequestClose={() => setShowAllLibrary(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.libraryModal}>
            <View style={styles.libraryHeader}>
              <View>
                <Text style={styles.libraryTitle}>Complete Activity Library</Text>
                <Text style={styles.librarySubtitle}>Simple ways to spend time together</Text>
              </View>
              <Pressable onPress={() => setShowAllLibrary(false)} style={styles.closeButton} accessibilityLabel="Close">
                <X size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagRow}>
              {TAG_FILTERS.map((tag) => (
                <Pressable
                  key={tag}
                  onPress={() => setSelectedTagFilter(tag)}
                  style={[styles.tagChip, selectedTagFilter === tag && styles.tagChipActive]}
                >
                  <Text style={[styles.tagChipText, selectedTagFilter === tag && styles.tagChipTextActive]}>{tag}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <ScrollView contentContainerStyle={styles.libraryList}>
              {filteredLibrary.map((activity) => (
                <Pressable
                  key={activity.id}
                  style={styles.libraryCard}
                  onPress={() => {
                    setShowAllLibrary(false);
                    handleSelectActivity(activity);
                  }}
                >
                  <View style={styles.activityCardLeft}>
                    <View style={styles.activityIconBox}>{getActivityIcon(activity.iconName)}</View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.activityTitle}>{activity.title}</Text>
                      <Text style={styles.libraryCardMeta} numberOfLines={2}>
                        {activity.duration} &bull; {activity.description}
                      </Text>
                    </View>
                  </View>
                  <ArrowRight size={16} color="#9CA3AF" />
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showAiModal} animationType="slide" transparent onRequestClose={() => setShowAiModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowAiModal(false)}>
          <Pressable style={styles.aiModal} onPress={(e) => e.stopPropagation()}>
            <View style={styles.aiModalHeader}>
              <View style={styles.aiCardHeaderLeft}>
                <View style={styles.aiIconBadge}>
                  <Sparkles size={15} color="#fff" />
                </View>
                <Text style={styles.aiModalTitle}>Idea Generator for You + {friendFirstName}</Text>
              </View>
              <Pressable onPress={() => setShowAiModal(false)} accessibilityLabel="Close">
                <X size={16} color={colors.textSecondary} />
              </Pressable>
            </View>

            <Text style={styles.dialSectionLabel}>QUICK CONTEXT FOR BOTH OF YOU</Text>

            <Text style={styles.dialLabel}>Available time:</Text>
            <View style={styles.dialRow}>
              {TIME_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  style={[styles.dialOption, aiTime === option && styles.dialOptionActive]}
                  onPress={() => setAiTime(option)}
                >
                  <Text style={[styles.dialOptionText, aiTime === option && styles.dialOptionTextActive]}>{option}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.dialLabel}>Setting:</Text>
            <View style={styles.dialRow}>
              {SETTING_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  style={[styles.dialOption, aiSetting === option && styles.dialOptionActive]}
                  onPress={() => setAiSetting(option)}
                >
                  <Text style={[styles.dialOptionText, aiSetting === option && styles.dialOptionTextActive]}>{option}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.dialLabel}>Energy level:</Text>
            <View style={styles.dialRow}>
              {ENERGY_OPTIONS.map((option) => (
                <Pressable
                  key={option}
                  style={[styles.dialOption, aiEnergy === option && styles.dialOptionActive]}
                  onPress={() => setAiEnergy(option)}
                >
                  <Text style={[styles.dialOptionText, aiEnergy === option && styles.dialOptionTextActive]}>{option}</Text>
                </Pressable>
              ))}
            </View>

            {isGenerating ? (
              <Text style={styles.aiThinking}>Thinking of something for you two...</Text>
            ) : aiIdea ? (
              <View style={styles.aiResultCard}>
                <View style={styles.aiResultHeader}>
                  <Text style={styles.aiResultLabel}>HERE'S AN IDEA FOR YOU TWO</Text>
                  <View style={styles.aiResultDurationPill}>
                    <Text style={styles.aiResultDurationText}>{aiTime}</Text>
                  </View>
                </View>
                <Text style={styles.aiResultTitle}>{aiIdea.title}</Text>
                <Text style={styles.aiResultDescription}>{aiIdea.description}</Text>
              </View>
            ) : (
              <Text style={styles.aiThinking}>Couldn't get an idea right now -- try again.</Text>
            )}

            <Pressable style={[styles.aiSuggestButton, !aiIdea && styles.disabled]} disabled={!aiIdea} onPress={handleAcceptAiIdea}>
              <Check size={16} color="#fff" />
              <Text style={styles.aiSuggestButtonText}>Let's do this</Text>
            </Pressable>
            <Pressable style={styles.tryAnotherButton} onPress={handleGenerateAiIdea} disabled={isGenerating}>
              <Shuffle size={15} color={colors.textSecondary} />
              <Text style={styles.tryAnotherButtonText}>{isGenerating ? 'Thinking...' : 'Try another idea'}</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  nav: { height: 52, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  pill: { paddingHorizontal: 10, paddingVertical: 2, borderRadius: 999, backgroundColor: colors.lavender100 },
  pillText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.lavender600 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headlineBlock: { gap: 6, marginBottom: spacing.md },
  headline: { fontFamily: fonts.serif, fontSize: 26, lineHeight: 31, color: colors.textPrimary, letterSpacing: -0.3 },
  subtitle: { fontFamily: fonts.sans, fontSize: 13.5, lineHeight: 19, color: colors.textSecondary },

  aiCard: { backgroundColor: colors.lavender50, borderWidth: 1, borderColor: colors.lavender200, borderRadius: 16, padding: spacing.md, gap: 10, marginBottom: spacing.md },
  aiCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  aiCardHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  aiIconBadge: { width: 28, height: 28, borderRadius: 8, backgroundColor: colors.lavender600, alignItems: 'center', justifyContent: 'center' },
  aiCardTitle: { fontFamily: fonts.serifItalic, fontSize: 15, color: colors.textPrimary },
  aiCardTag: { backgroundColor: '#fff', borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
  aiCardTagText: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.lavender600 },
  aiCardBody: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 18, color: colors.lavender800 },
  aiSuggestButton: { height: 42, borderRadius: 12, backgroundColor: colors.lavender600, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  aiSuggestButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: '#fff' },
  disabled: { opacity: 0.5 },

  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm, paddingHorizontal: 2 },
  sectionLabel: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 0.5, color: '#9CA3AF' },
  sectionMeta: { fontFamily: fonts.sans, fontSize: 11, color: colors.textSecondary },

  activityCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  activityIconBox: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.canvas, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  activityTitle: { fontFamily: fonts.sansSemiBold, fontSize: 15, color: colors.textPrimary },
  activityMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  activityMetaText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.textSecondary },
  activityMetaDot: { fontSize: 12, color: colors.textSecondary },
  activityArrow: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.canvas, alignItems: 'center', justifyContent: 'center' },

  viewAllRow: { paddingVertical: spacing.lg, alignItems: 'center' },
  viewAllButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.lavender200 },
  viewAllButtonText: { fontFamily: fonts.sansSemiBold, fontSize: 14, color: colors.lavender600 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  libraryModal: { maxHeight: '85%', backgroundColor: colors.canvas, borderTopLeftRadius: 28, borderTopRightRadius: 28 },
  libraryHeader: { padding: spacing.lg, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  libraryTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.textPrimary },
  librarySubtitle: { fontFamily: fonts.sans, fontSize: 12, color: colors.textSecondary },
  closeButton: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tagRow: { paddingHorizontal: spacing.lg, paddingVertical: 10, gap: 8 },
  tagChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  tagChipActive: { backgroundColor: colors.lavender600, borderColor: colors.lavender600 },
  tagChipText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.textSecondary },
  tagChipTextActive: { color: '#fff' },
  libraryList: { padding: spacing.lg, gap: spacing.sm },
  libraryCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  libraryCardMeta: { fontFamily: fonts.sans, fontSize: 12, color: colors.textSecondary, marginTop: 3 },

  aiModal: { maxHeight: '88%', backgroundColor: colors.canvas, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.lg, gap: 10 },
  aiModalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  aiModalTitle: { fontFamily: fonts.serif, fontSize: 16, color: colors.textPrimary, flexShrink: 1 },
  dialSectionLabel: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 0.5, color: '#9CA3AF', marginTop: 4 },
  dialLabel: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.textSecondary },
  dialRow: { flexDirection: 'row', gap: 8 },
  dialOption: { flex: 1, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  dialOptionActive: { backgroundColor: colors.lavender600, borderColor: colors.lavender600 },
  dialOptionText: { fontFamily: fonts.sansMedium, fontSize: 12, color: colors.textPrimary },
  dialOptionTextActive: { color: '#fff' },
  aiThinking: { fontFamily: fonts.sans, fontSize: 13, color: colors.textSecondary, textAlign: 'center', paddingVertical: spacing.sm },
  aiResultCard: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.lavender200, borderRadius: 16, padding: spacing.md, gap: 8 },
  aiResultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  aiResultLabel: { fontFamily: fonts.sansSemiBold, fontSize: 11, letterSpacing: 0.5, color: colors.lavender600 },
  aiResultDurationPill: { backgroundColor: colors.lavender100, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  aiResultDurationText: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.lavender800 },
  aiResultTitle: { fontFamily: fonts.serif, fontSize: 19, color: colors.textPrimary },
  aiResultDescription: { fontFamily: fonts.sans, fontSize: 13.5, lineHeight: 19, color: '#4B5563' },
  tryAnotherButton: { height: 44, borderRadius: 999, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  tryAnotherButtonText: { fontFamily: fonts.sansMedium, fontSize: 14, color: colors.textSecondary },
});
