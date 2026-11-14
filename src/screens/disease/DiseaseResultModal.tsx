import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { DiseaseDetection } from '../../types';
import { colors } from '../../constants/colors';
import {
  X,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Leaf,
  FlaskConical,
  RotateCcw,
} from 'lucide-react-native';

interface DiseaseResultModalProps {
  visible: boolean;
  result: DiseaseDetection | null;
  onClose: () => void;
  onScanAnother: () => void;
}

export const DiseaseResultModal: React.FC<DiseaseResultModalProps> = ({
  visible,
  result,
  onClose,
  onScanAnother,
}) => {
  if (!result) return null;

  const isHealthy = result.diseaseName.toLowerCase().includes('healthy');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.titleGroup}>
            <Text style={styles.topTitle}>Diagnosis Results</Text>
            <View style={styles.demoTag}>
              <Text style={styles.demoTagText}>DEMO AI DIAGNOSIS</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <X size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Leaf image header with overlay */}
          <View style={styles.imageBox}>
            <Image source={{ uri: result.imageUri }} style={styles.image} />
            <View style={styles.confidenceOverlay}>
              <Text style={styles.confidenceLabel}>Confidence</Text>
              <Text style={styles.confidenceValue}>{result.confidence}%</Text>
            </View>
          </View>

          {/* Disease title & severity badge */}
          <View style={styles.headerBlock}>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.severityBadge,
                  {
                    backgroundColor: isHealthy
                      ? '#DCFCE7'
                      : result.severity === 'Severe'
                      ? '#FEE2E2'
                      : '#FEF3C7',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.severityText,
                    {
                      color: isHealthy
                        ? '#16A34A'
                        : result.severity === 'Severe'
                        ? '#DC2626'
                        : '#B45309',
                    },
                  ]}
                >
                  {isHealthy ? 'Healthy Plant' : `${result.severity} Severity`}
                </Text>
              </View>
              <Text style={styles.dateStamp}>{result.date}</Text>
            </View>

            <Text style={styles.diseaseTitle}>{result.diseaseName}</Text>
            <Text style={styles.cropSub}>{result.cropName}</Text>
            <Text style={styles.description}>{result.description}</Text>
          </View>

          {/* Expert Disclaimer Alert */}
          <View style={styles.disclaimerBox}>
            <AlertTriangle size={18} color="#B45309" />
            <Text style={styles.disclaimerText}>
              Disclaimer: This AI prediction is simulated for educational and demo purposes. Always consult local agricultural extension officers or certified agronomists before applying chemical pesticides.
            </Text>
          </View>

          {/* Symptoms Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <ShieldAlert size={18} color="#EF4444" />
              <Text style={styles.sectionTitle}>Identified Symptoms</Text>
            </View>
            {result.symptoms.map((symp, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={styles.redDot} />
                <Text style={styles.bulletText}>{symp}</Text>
              </View>
            ))}
          </View>

          {/* Treatment Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Leaf size={18} color="#16A34A" />
              <Text style={styles.sectionTitle}>Organic & Biological Control</Text>
            </View>
            {result.treatment.organic.map((treat, i) => (
              <View key={i} style={styles.bulletRow}>
                <CheckCircle2 size={16} color="#16A34A" />
                <Text style={styles.bulletText}>{treat}</Text>
              </View>
            ))}

            <View style={[styles.sectionTitleRow, { marginTop: 14 }]}>
              <FlaskConical size={18} color="#0284C7" />
              <Text style={styles.sectionTitle}>Chemical Treatment Options</Text>
            </View>
            {result.treatment.chemical.map((chem, i) => (
              <View key={i} style={styles.bulletRow}>
                <CheckCircle2 size={16} color="#0284C7" />
                <Text style={styles.bulletText}>{chem}</Text>
              </View>
            ))}
          </View>

          {/* Prevention Guidelines */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <CheckCircle2 size={18} color={colors.primary} />
              <Text style={styles.sectionTitle}>Prevention & Agronomic Care</Text>
            </View>
            {result.prevention.map((prev, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={styles.greenDot} />
                <Text style={styles.bulletText}>{prev}</Text>
              </View>
            ))}
          </View>

          {/* Action buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.scanAnotherBtn}
              onPress={() => {
                onClose();
                onScanAnother();
              }}
              activeOpacity={0.8}
            >
              <RotateCcw size={16} color="#FFFFFF" />
              <Text style={styles.scanAnotherText}>Scan Another Plant</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.doneText}>Close Results</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  demoTag: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  demoTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0369A1',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  imageBox: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  confidenceOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 10,
    color: '#A7F3D0',
    fontWeight: '600',
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 11,
    fontWeight: '800',
  },
  dateStamp: {
    fontSize: 11,
    color: colors.textMuted,
  },
  diseaseTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.3,
  },
  cropSub: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: 8,
  },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    gap: 10,
    marginBottom: 14,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
    flex: 1,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
    marginTop: 6,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
    marginTop: 6,
  },
  bulletText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    flex: 1,
  },
  actionsContainer: {
    gap: 10,
    marginTop: 8,
  },
  scanAnotherBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scanAnotherText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
  },
  doneText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});
