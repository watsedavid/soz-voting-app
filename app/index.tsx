import { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../lib/supabase';

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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {!votingActive && (
        <View style={styles.closedBanner}>
          <Text style={styles.closedText}>🔴 Voting is currently closed</Text>
        </View>
      )}

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
          <TouchableOpacity style={styles.voteBtn} onPress={() => router.push('/vote')}>
            <Text style={styles.voteBtnText}>Vote Now →</Text>
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
  content: { padding: 16, gap: 16 },
  closedBanner: { backgroundColor: '#fef2f2', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#fecaca' },
  closedText: { fontSize: 12, fontWeight: 'bold', color: '#dc2626', textAlign: 'center' },
  countdownCard: { backgroundColor: '#0f172a', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1e293b' },
  countdownLabel: { color: '#94a3b8', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 },
  countdownRow: { flexDirection: 'row', gap: 28 },
  countdownItem: {},
  countdownNum: { color: '#ffffff', fontSize: 30, fontWeight: 'bold' },
  countdownUnit: { color: '#475569', fontSize: 8, textTransform: 'uppercase', letterSpacing: 2 },
  sectionLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  featuredCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  featuredBadge: { backgroundColor: '#2563eb', borderRadius: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, marginBottom: 10 },
  featuredBadgeText: { color: '#ffffff', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  featuredName: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  featuredBio: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 16 },
  voteBtn: { backgroundColor: '#2563eb', borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  voteBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  securityNote: { backgroundColor: '#f1f5f9', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  securityTitle: { fontSize: 11, fontWeight: 'bold', color: '#334155', marginBottom: 4 },
  securityText: { fontSize: 10, color: '#64748b', lineHeight: 15 },
  empty: { fontSize: 12, color: '#64748b', textAlign: 'center' },
});
