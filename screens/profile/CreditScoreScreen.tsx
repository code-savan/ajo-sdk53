import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ArrowLeft, Info, RefreshCw, ArrowUpRight, ArrowUp, Calendar, DollarSign, Search } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';

export default function CreditScoreScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [isPending, setIsPending] = useState(true);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    // Simulate fetching score: start pending, then reveal
    setIsPending(true);
    const t = setTimeout(() => {
      setScore(750);
      setIsPending(false);
    }, 1200);
    return () => clearTimeout(t);
  }, []);

  const scaleMarkerLeftPct = useMemo(() => {
    const s = score ?? 300;
    const min = 300;
    const max = 850;
    const pct = ((s - min) / (max - min)) * 100;
    return Math.min(100, Math.max(0, pct));
  }, [score]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#111827" size={24} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Credit score</Text>
        {/* <View style={{ width: 24 }} /> */}
      </View>

      {/* Scrollable content */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
      {/* Heading */}
      <View style={{ paddingHorizontal: 20, marginTop: 8 }}>
        <Text style={styles.h1}>Your credit score health</Text>
        <Text style={styles.subtext}>
          Track how your credit score affects your access to features and financial credibility.
        </Text>
      </View>

      {/* Main score */}
      <View style={{ alignItems: 'center', marginTop: 16 }}>
        {isPending ? (
          <Text style={styles.scoreText}>0</Text>
        ) : (
          <Text style={styles.scoreText}>{String(score)}</Text>
        )}
        <View style={styles.scoreRow}>
          <Text style={styles.scoreQuality}>Your credit in excellent shape</Text>
          <Info size={14} color="#3358FF" style={{ marginLeft: 6 }} />
        </View>
      </View>

      {/* Scale */}
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <View style={styles.scaleContainer}>
          <LinearGradient
            colors={["#f97316", "#f59e0b", "#84cc16", "#22c55e"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.scaleGradient}
          />
          {/* marker */}
          <View style={[styles.marker, { left: `${scaleMarkerLeftPct}%` }]} />
        </View>
        <View style={styles.scaleLabelsRow}>
          <Text style={styles.scaleLabel}>300</Text>
          <Text style={styles.scaleLabel}>560</Text>
          <Text style={styles.scaleLabel}>750</Text>
          <Text style={styles.scaleLabel}>850</Text>
        </View>
      </View>

      {/* Updated row */}
      <View style={styles.updatedRow}>
        <Text style={styles.updatedText}>Updated 5 days ago</Text>
        <RefreshCw color="#6B7280" size={18} />
      </View>

      {/* Insight card */}
      <View style={styles.insightCard}>
        <ArrowUp color="#10B981" size={18} />
        <Text style={styles.insightText}>Your credit score increased by <Text style={styles.insightEmph}>14%</Text></Text>
      </View>

      {/* Factors */}
      <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
        <Text style={styles.factorsTitle}>Factors that affect your credit score</Text>

        {/* On-time Payment */}
        <View style={styles.factorCard}>
          <View style={styles.factorRow}>
            <View style={styles.factorLeft}>
            <Calendar color="#6B7280" size={16} />
              <View>
                <Text style={styles.factorTitle}>On-time Payment</Text>
                <Text style={styles.factorSubtitle}><Text style={styles.subtitleLabel}>Current Payment: </Text><Text style={styles.subtitleValueGreen}>90% on-time</Text></Text>
              </View>
            </View>
          </View>
        </View>

        {/* Credit Utilization */}
        <View style={styles.factorCard}>
          <View style={styles.factorRow}>
            <View style={styles.factorLeft}>
            <DollarSign color="#6B7280" size={16} />
              <View>
                <Text style={styles.factorTitle}>Credit Utilization</Text>
                <Text style={styles.factorSubtitle}><Text style={styles.subtitleLabel}>Current: </Text><Text style={styles.subtitleValueGreen}>30% of available credit used</Text></Text>
              </View>
            </View>
            <Info color="#3358FF" size={18} />
          </View>
        </View>

        {/* Recent Credit Inquiries */}
        <View style={styles.factorCard}>
          <View style={styles.factorRow}>
            <View style={styles.factorLeft}>
            <Search color="#6B7280" size={16} />
              <View>
                <Text style={styles.factorTitle}>Recent Credit Inquiries</Text>
                <Text style={styles.factorSubtitle}><Text style={styles.subtitleLabel}>Status: </Text>On track</Text>
              </View>
            </View>
            <Info color="#3358FF" size={18} />
          </View>
        </View>
      </View>

      {/* Recommendations */}
      <View style={{ marginTop: 28, paddingHorizontal: 16 }}>
        <Text style={styles.recommendationsTitle}>Recommendations</Text>
        <View style={styles.recommendationsCard}>
          <Text style={styles.recommendationsHeader}>Recommendations to help improve your credit score.</Text>

          <View style={styles.recItem}>
            <Text style={styles.recItemTitle}>Contribute Consistently to Groups</Text>
            <Text style={styles.recItemText}>Regular and on-time contributions show financial responsibility and build trust across your financial profile.</Text>
          </View>

          <View style={styles.recItem}>
            <Text style={styles.recItemTitle}>Avoid Missed Payments</Text>
            <Text style={styles.recItemText}>Ensure you meet all payment deadlines in your contribution groups, delays can reflect poorly on your credit behavior.</Text>
          </View>

          <View style={styles.recItem}>
            <Text style={styles.recItemTitle}>Fund Your Wallet Regularly</Text>
            <Text style={styles.recItemText}>Maintaining an active and well-funded wallet shows you're financially engaged and prepared.</Text>
          </View>

          <View style={styles.recItem}>
            <Text style={styles.recItemTitle}>Keep Low Outstanding Balances</Text>
            <Text style={styles.recItemText}>Avoid having too many unpaid group obligations at once. Pay them off early when possible.</Text>
          </View>

          <View style={styles.recItem}>
            <Text style={styles.recItemTitle}>Complete Full KYC Verification</Text>
            <Text style={styles.recItemText}>A verified profile improves your credibility, giving you access to better features and potentially higher contribution limits.</Text>
          </View>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topTitle: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '400',
  },
  h1: {
    fontSize: 16,
    marginTop: 25,
    color: '#1E1E1E',
    fontWeight: '500',
  },
  subtext: {
    marginTop: 8,
    color: '#928F8B',
    fontSize: 12,
    fontWeight: '400',
  },
  scoreText: {
    fontSize: 50,
    color: '#000000',
    letterSpacing: 1,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  scoreQuality: {
    color: '#6C6C6C',
    fontSize: 12,
  },
  scaleContainer: {
    height: 20,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
  },
  scaleGradient: {
    height: '100%',
    width: '100%',
    borderRadius: 999,
  },
  marker: {
    position: 'absolute',
    height: 32,
    width: 1,
    top: -4,
    backgroundColor: '#4B5563',
  },
  scaleLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
    overflow: "visible"
  },
  scaleLabel: {
    color: '#6C6C6C',
    fontSize: 12,
  },
  updatedRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8 as any,
  },
  updatedText: {
    color: '#232323',
    fontSize: 12,
    marginRight: 8,
    marginTop: 15
  },
  insightCard: {
    marginVertical: 40,
    marginHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCDCDC',
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10 as any,
    alignSelf: 'center',

  },
  insightText: {
    color: '#3B3B3B',
    fontSize: 12,
    fontWeight: '400',
  },
  insightEmph: {
    color: '#10B981',
    fontWeight: '600',
  },
  factorsTitle: {
    fontSize: 14,
    color: '#6C6C6C',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  factorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  factorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12 as any,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    // backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  factorTitle: {
    fontSize: 14,
    color: '#3B3B3B',
    marginBottom: 6,
  },
  factorSubtitle: {
    fontSize: 12,
    color: '#6C6C6C',
  },
  subtitleLabel: {
    color: '#6B7280',
  },
  subtitleValueGreen: {
    color: '#10B981',
  },
  recommendationsTitle: {
    fontSize: 14,
    color: '#6C6C6C',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  recommendationsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  recommendationsHeader: {
    fontSize: 14,
    color: '#3B3B3B',
    fontWeight: '500',
    marginBottom: 20,
  },
  recItem: {
    marginBottom: 18,
  },
  recItemTitle: {
    fontSize: 12,
    color: '#1E1E1E',
    marginBottom: 8,
    fontWeight: '400',
  },
  recItemText: {
    fontSize: 12,
    color: '#6C6C6C',
    lineHeight: 20,
    fontWeight: '400',
  },
});
