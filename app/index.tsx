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
  require('../assets/flyer3.png'),
  require('../assets/flyer4.jpg'),
  require('../assets/flyer5.png'),
];

type Contestant = {
  id: string;
  name: string;
  bio: string;
  vote_count: number;
  is_active: boolean;
};

export default function HomeScreen() {
  const router = useRouter();
  const [featured, setFeatured] = useState<Contestant | null>(null);
  const [loading, setLoading] = useState(true);
  const [votingActive, setVotingActive] = useState(true);
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
      if (settings) setVotingActive(settings.voting_active);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Auto-slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeSlide + 1) % FLYERS.length;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveSlide(next);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeSlide]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {!votingActive && (
        <View style={styles.closedBanner}>
          <Text style={styles.closedText}>🔴 Voting is currently closed</Text>
        </View>
      )}

      {/* Flyer Carousel */}
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
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveSlide(index);
          }}
          renderItem={({ item }) => (
            <Image source={item} style={styles.flyerImage} resizeMode="cover" />
          )}
        />
        {/* Dot indicators */}
        <View style={styles.dotsRow}>
          {FLYERS.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeSlide && styles.dotActive]} />
          ))}
        </View>
      </View>

      {/* Countdown Banner */}
      <View style={styles.countdownCard}>
        <Text style={styles.countdownLabel}>Season 5 Finals Ends In</Text>
        <View style={styles.countdownRow}>
          {[['12', 'DAYS'], ['08', 'HRS'], ['45', 'MIN']].map(([val, unit]) => (
            <View key={unit} style={styles.countdownItem}>
              <Text style={styles.countdownNum}>{val}</Text>
              <Text style={styles.countdownUnit}>{unit}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Featured Contestant */}
      <Text style={styles.sectionLabel}>⭐ FEATURED CONTESTANT</Text>

      {loading ? (
        <ActivityIndicator color="#2563eb" size="large" />
      ) : featured ? (
        <View style={styles.featuredCard}>
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredBadgeText}>TOP CANDIDATE</Text>
          </View>
          <Text style={styles.featuredName}>{featured.name}</Text>
          <Text style={styles.featuredBio}>{featured.bio}</Text>
          <TouchableOpacity
            style={[styles.voteBtn, !votingActive && styles.voteBtnDisabled]}
            onPress={() => votingActive && router.push('/vote')}
          >
            <Text style={styles.voteBtnText}>
              {votingActive ? 'Vote Now →' : 'Voting Closed'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.empty}>No contestants yet.</Text>
      )}

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
  content: { gap: 16, paddingBottom: 24 },
  closedBanner: { backgroundColor: '#fef2f2', margin: 16, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#fecaca' },
  closedText: { fontSize: 12, fontWeight: 'bold', color: '#dc2626', textAlign: 'center' },
  carouselContainer: { width: '100%' },
  flyerImage: { width, height: width * 1.1 },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 10 },
  dot: { width: 6, height: 6, borderRadius: 99, backgroundColor: '#cbd5e1' },
  dotActive: { width: 20, backgroundColor: '#2563eb' },
  countdownCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#1e293b' },
  countdownLabel: { color: '#94a3b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  countdownRow: { flexDirection: 'row', gap: 28 },
  countdownItem: {},
  countdownNum: { color: '#ffffff', fontSize: 30, fontWeight: 'bold' },
  countdownUnit: { color: '#475569', fontSize: 8, textTransform: 'uppercase', letterSpacing: 2 },
  sectionLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 16 },
  featuredCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginHorizontal: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  featuredBadge: { backgroundColor: '#2563eb', borderRadius: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, marginBottom: 10 },
  featuredBadgeText: { color: '#ffffff', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  featuredName: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  featuredBio: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 16 },
  voteBtn: { backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  voteBtnDisabled: { backgroundColor: '#94a3b8' },
  voteBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  securityNote: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 14, marginHorizontal: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  securityTitle: { fontSize: 11, fontWeight: 'bold', color: '#334155', marginBottom: 4 },
  securityText: { fontSize: 10, color: '#64748b', lineHeight: 15 },
  empty: { fontSize: 12, color: '#64748b', textAlign: 'center' },
});
