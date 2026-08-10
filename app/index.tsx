import { useEffect, useState, useRef } from 'react';
import {
  ScrollView, View, Text, TouchableOpacity, StyleSheet,
  ActivityIndicator, Image, Dimensions, Animated, FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

const FLYERS = [
  require('../assets/flyer1.jpg'),
  require('../assets/flyer2.jpg'),
  require('../assets/flyer3.jpg'),
  require('../assets/flyer4.jpg'),
  require('../assets/flyer5.jpg'),
];

type Contestant = {
  id: string;
  name: string;
  bio: string;
  vote_count: number;
  is_active: boolean;
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(deadline: string): TimeLeft {
  const diff = new Date(deadline).getTime() - new Date().getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function HomeScreen() {
  const router = useRouter();
  const [featured, setFeatured] = useState<Contestant | null>(null);
  const [loading, setLoading] = useState(true);
  const [votingActive, setVotingActive] = useState(true);
  const [deadline, setDeadline] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [activeSlide, setActiveSlide] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const fetchData = async () => {
      const { data: contestants } = await supabase
        .from('contestants')
        .select('*')
        .eq('is_active', true)
        .order('vote_count', { ascending: false })
        .limit(1);

      const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'global')
        .single();

      if (contestants && contestants.length > 0) setFeatured(contestants[0]);
      if (settings) {
        setVotingActive(settings.voting_active);
        if (settings.voting_deadline) {
          setDeadline(settings.voting_deadline);
          setTimeLeft(getTimeLeft(settings.voting_deadline));
        }
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Live countdown ticker
  useEffect(() => {
    if (!deadline) return;
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  // Auto-slide carousel
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeSlide + 1) % FLYERS.length;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveSlide(next);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {!votingActive && (
        <View style={styles.closedBanner}>
          <Text style={styles.closedText}>🔴 Voting is currently closed</Text>
        </View>
      )}

      {/* Live Countdown Banner */}
      <View style={styles.countdownCard}>
        <Text style={styles.countdownLabel}>⏱ TIME LEFT TO VOTE</Text>
        <View style={styles.countdownRow}>
          {[
            [pad(timeLeft.days), 'DAYS'],
            [pad(timeLeft.hours), 'HRS'],
            [pad(timeLeft.minutes), 'MIN'],
            [pad(timeLeft.seconds), 'SEC'],
          ].map(([val, unit]) => (
            <View key={unit} style={styles.countdownItem}>
              <Text style={styles.countdownNum}>{val}</Text>
              <Text style={styles.countdownUnit}>{unit}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Flyer Carousel */}
      <View style={styles.carouselWrapper}>
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={FLYERS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => i.toString()}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (width - 32));
              setActiveSlide(index);
            }}
            renderItem={({ item }) => (
              <Image source={item} style={styles.flyerImage} resizeMode="cover" />
            )}
          />
        </View>
        <View style={styles.dotsRow}>
          {FLYERS.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeSlide && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* Vote Now Button */}
      <TouchableOpacity
        style={[styles.voteNowBtn, !votingActive && styles.voteBtnDisabled]}
        onPress={() => votingActive && router.push('/vote')}
        activeOpacity={0.85}
      >
        <Text style={styles.voteNowBtnText}>
          {votingActive ? 'Vote Now ᴺ' : 'Voting Closed'}
        </Text>
      </TouchableOpacity>

      {/* Security Note */}
      <View style={styles.securityNote}>
        <Text style={styles.securityTitle}>🔒 Auditable Security</Text>
        <Text style={styles.securityText}>
          Voter screens are decoupled from vote tallies. Only verified Paystack webhook signatures authorize transactions.
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { gap: 16, paddingBottom: 24, paddingTop: 16 },
  closedBanner: {
    backgroundColor: '#fef2f2', marginHorizontal: 16, borderRadius: 12,
    padding: 12, borderWidth: 1, borderColor: '#fecaca',
  },
  closedText: { fontSize: 12, fontWeight: 'bold', color: '#dc2626', textAlign: 'center' },

  // Countdown
  countdownCard: {
    backgroundColor: '#0f172a', borderRadius: 16, padding: 16,
    marginHorizontal: 16, borderWidth: 1, borderColor: '#1e293b',
  },
  countdownLabel: {
    color: '#94a3b8', fontSize: 10, textTransform: 'uppercase',
    letterSpacing: 1, marginBottom: 12,
  },
  countdownRow: { flexDirection: 'row', justifyContent: 'space-between' },
  countdownItem: { alignItems: 'center', flex: 1 },
  countdownNum: {
    color: '#ffffff', fontSize: 30, fontWeight: 'bold', fontFamily: 'monospace',
  },
  countdownUnit: {
    color: '#ffffff', fontSize: 9, textTransform: 'uppercase',
    letterSpacing: 2, marginTop: 4, opacity: 0.7,
  },

  // Carousel
  carouselWrapper: { marginHorizontal: 16 },
  carouselContainer: {
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 4,
  },
  flyerImage: { width: width - 32, height: (width - 32) * 1.05 },
  dotsRow: {
    flexDirection: 'row', justifyContent: 'center',
    gap: 6, paddingVertical: 10,
  },
  dot: { width: 6, height: 6, borderRadius: 99, backgroundColor: '#cbd5e1' },
  dotActive: { width: 20, backgroundColor: '#2563eb' },

  // Vote Now Button
  voteNowBtn: {
    backgroundColor: '#2563eb',
    marginHorizontal: 16,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  voteBtnDisabled: { backgroundColor: '#94a3b8' },
  voteNowBtnText: {
    color: '#ffffff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5,
  },

  // Security
  securityNote: {
    backgroundColor: '#f1f5f9', borderRadius: 12, padding: 14,
    marginHorizontal: 16, borderWidth: 1, borderColor: '#e2e8f0',
  },
  securityTitle: { fontSize: 11, fontWeight: 'bold', color: '#334155', marginBottom: 4 },
  securityText: { fontSize: 10, color: '#64748b', lineHeight: 15 },
  empty: { fontSize: 12, color: '#64748b', textAlign: 'center' },
});
