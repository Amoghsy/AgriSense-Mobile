import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../constants/colors';
import { useDetection } from '../../context/DetectionContext';
import { Header } from '../../components/common/Header';
import { DiseaseResultModal } from '../disease/DiseaseResultModal';
import {
  sampleLeaves as defaultSampleLeaves,
  fetchSampleLeaves,
  SampleLeaf,
} from '../../constants/mockData';
import {
  Camera,
  Image as ImageIcon,
  Scan,
  Sparkles,
  History,
  AlertCircle,
  HelpCircle,
} from 'lucide-react-native';

interface DiseaseScreenProps {
  navigation: any;
}

export const DiseaseScreen: React.FC<DiseaseScreenProps> = ({ navigation }) => {
  const { analyzeImage, isAnalyzing, latestResult, history } = useDetection();
  const [leaves, setLeaves] = useState<SampleLeaf[]>(defaultSampleLeaves);
  const [selectedImage, setSelectedImage] = useState<string | null>(defaultSampleLeaves[0]?.uri || null);
  const [modalVisible, setModalVisible] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState('Extracting leaf texture features...');

  useEffect(() => {
    fetchSampleLeaves().then(setLeaves);
  }, []);

  const pickFromGallery = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Needed',
          'Gallery access is needed to select a leaf photo from your phone.'
        );
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setSelectedImage(res.assets[0].uri);
      }
    } catch (e) {
      console.warn('Error picking image', e);
      Alert.alert('Notice', 'Unable to open gallery. You can use sample leaf images below.');
    }
  };

  const captureCamera = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Camera Permission',
          'Camera access is needed to take a leaf photo. Using high-resolution sample leaf instead.'
        );
        setSelectedImage(leaves[0]?.uri || defaultSampleLeaves[0].uri);
        return;
      }

      const res = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setSelectedImage(res.assets[0].uri);
      }
    } catch (e) {
      console.warn('Camera error', e);
      Alert.alert('Notice', 'Camera simulation fallback: selected sample leaf.');
      setSelectedImage(leaves[0]?.uri || defaultSampleLeaves[0].uri);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      Alert.alert('Select Image', 'Please capture or pick a leaf image first.');
      return;
    }

    setAnalyzingStep('Scanning chlorophyll & cellular lesions...');
    const stepTimer = setTimeout(() => {
      setAnalyzingStep('Comparing with 54,000+ agricultural pathogen patterns...');
    }, 700);

    const stepTimer2 = setTimeout(() => {
      setAnalyzingStep('Compiling organic & chemical cure protocols...');
    }, 1200);

    try {
      await analyzeImage(selectedImage);
      clearTimeout(stepTimer);
      clearTimeout(stepTimer2);
      setModalVisible(true);
    } catch (e) {
      Alert.alert('Error', 'Diagnosis simulation failed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="AI Plant Doctor"
        subtitle="Leaf Diagnostic & Pathology Engine"
        showRoleSwitch={false}
        rightAction={
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => navigation.navigate('DiseaseHistory')}
            activeOpacity={0.7}
          >
            <History size={18} color={colors.textPrimary} />
            <Text style={styles.historyBtnText}>({history.length})</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Main Leaf Viewport / Camera Frame */}
        <View style={styles.scannerCard}>
          <View style={styles.imageFrame}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderBox}>
                <Scan size={56} color={colors.primary} />
                <Text style={styles.placeholderText}>
                  Position leaf inside frame
                </Text>
              </View>
            )}

            {/* Corner guide lines */}
            <View style={[styles.cornerGuide, styles.topLeft]} />
            <View style={[styles.cornerGuide, styles.topRight]} />
            <View style={[styles.cornerGuide, styles.bottomLeft]} />
            <View style={[styles.cornerGuide, styles.bottomRight]} />

            {/* AI badge overlay */}
            <View style={styles.aiBadgeOverlay}>
              <Sparkles size={13} color="#FFFFFF" />
              <Text style={styles.aiBadgeText}>AI Vision Scanner</Text>
            </View>
          </View>

          {/* Camera / Gallery controls */}
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={captureCamera}
              activeOpacity={0.8}
            >
              <Camera size={20} color={colors.primary} />
              <Text style={styles.controlBtnText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlBtn}
              onPress={pickFromGallery}
              activeOpacity={0.8}
            >
              <ImageIcon size={20} color={colors.primary} />
              <Text style={styles.controlBtnText}>Choose Gallery</Text>
            </TouchableOpacity>
          </View>

          {/* Primary Analyze Action */}
          <TouchableOpacity
            style={[styles.analyzeButton, isAnalyzing && styles.analyzeButtonDisabled]}
            onPress={handleAnalyze}
            disabled={isAnalyzing}
            activeOpacity={0.8}
          >
            {isAnalyzing ? (
              <View style={styles.analyzingRow}>
                <ActivityIndicator size="small" color="#FFFFFF" />
                <Text style={styles.analyzingText}>{analyzingStep}</Text>
              </View>
            ) : (
              <View style={styles.analyzeContent}>
                <Scan size={20} color="#FFFFFF" />
                <Text style={styles.analyzeButtonText}>Diagnose Leaf Health</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Instant Sample Test Leaves */}
        <View style={styles.sampleSection}>
          <View style={styles.sampleTitleRow}>
            <Text style={styles.sampleSectionTitle}>Quick Test Samples</Text>
            <Text style={styles.sampleSub}>Tap any sample to load for evaluation</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sampleScroll}
          >
            {leaves.map((leaf, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.sampleCard,
                  selectedImage === leaf.uri && styles.sampleCardActive,
                ]}
                onPress={() => setSelectedImage(leaf.uri)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: leaf.uri }} style={styles.sampleThumb} />
                <View style={styles.sampleMeta}>
                  <Text style={styles.sampleCardTitle} numberOfLines={1}>
                    {leaf.title}
                  </Text>
                  <Text style={styles.sampleCropName}>{leaf.crop}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Pathology Tips Box */}
        <View style={styles.guidelineCard}>
          <View style={styles.guideTitleRow}>
            <HelpCircle size={18} color="#0284C7" />
            <Text style={styles.guideTitle}>Guidelines for Accurate Diagnosis</Text>
          </View>
          <Text style={styles.guideBullet}>• Ensure bright, diffuse natural daylight (avoid harsh shadows).</Text>
          <Text style={styles.guideBullet}>• Focus closely on the infected leaf spot or lesion margin.</Text>
          <Text style={styles.guideBullet}>• Hold camera flat against the leaf surface without blurring.</Text>
        </View>
      </ScrollView>

      {/* Result Modal */}
      <DiseaseResultModal
        visible={modalVisible}
        result={latestResult}
        onClose={() => setModalVisible(false)}
        onScanAnother={() => {
          setSelectedImage(leaves[1]?.uri || defaultSampleLeaves[1]?.uri || null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  historyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  historyBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scannerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  imageFrame: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderBox: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  placeholderText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  cornerGuide: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#22C55E',
  },
  topLeft: {
    top: 14,
    left: 14,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 14,
    right: 14,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 14,
    left: 14,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 14,
    right: 14,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  aiBadgeOverlay: {
    position: 'absolute',
    top: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  aiBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 10,
    marginVertical: 14,
  },
  controlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    paddingVertical: 12,
  },
  controlBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  analyzeButton: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#1E5631CC',
  },
  analyzeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  analyzingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  sampleSection: {
    marginBottom: 20,
  },
  sampleTitleRow: {
    marginBottom: 10,
  },
  sampleSectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sampleSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sampleScroll: {
    gap: 10,
    paddingVertical: 4,
  },
  sampleCard: {
    width: 140,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  sampleCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  sampleThumb: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
  },
  sampleMeta: {
    padding: 8,
  },
  sampleCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sampleCropName: {
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 1,
  },
  guidelineCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  guideTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
  },
  guideBullet: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 4,
  },
});
