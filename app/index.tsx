import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

const FEATURED = {
  id: 'c3',
  name: 'Amina Bello',
  bio: 'Award-winning spoken word poet, activist, and creative writer dedicated to social narrative change.',
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Countdown Banner */}
      <View style={styles.countdownCard}>
        <Text style={styles.countdownLabel}>Season 4 Finals Ends In</Text>
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
      <View style={styles.featuredCard}>
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredBadgeText}>TOP CANDIDATE</Text>
        </View>
        <Text style={styles.featuredName}>{FEATURED.name}</Text>
        <Text style={styles.featuredBio}>{FEATURED.bio}</Text>
        <TouchableOpacity style={styles.voteBtn} onPress={() => router.push('/vote')}>
          <Text style={styles.voteBtnText}>Vote Now →</Text>
        </TouchableOpacity>
      </View>

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
  content: { padding: 16, gap: 16 },
  countdownCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  countdownLabel: {
    color: '#94a3b8', fontSize: 10,
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },
  countdownRow: { flexDirection: 'row', gap: 28 },
  countdownItem: {},
  countdownNum: { color: '#ffffff', fontSize: 30, fontWeight: 'bold' },
  countdownUnit: { color: '#475569', fontSize: 8, textTransform: 'uppercase', letterSpacing: 2 },
  sectionLabel: {
    color: '#64748b', fontSize: 10, fontWeight: 'bold',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  featuredCard: {
    backgroundColor: '#ffffff', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  featuredBadge: {
    backgroundColor: '#2563eb', borderRadius: 4,
    alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, marginBottom: 10,
  },
  featuredBadgeText: { color: '#ffffff', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 },
  featuredName: { fontSize: 20, fontWeight: 'bold', color: '#0f172a', marginBottom: 6 },
  featuredBio: { fontSize: 12, color: '#64748b', lineHeight: 18, marginBottom: 16 },
  voteBtn: {
    backgroundColor: '#2563eb', borderRadius: 10,
    paddingVertical: 13, alignItems: 'center',
  },
  voteBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  securityNote: {
    backgroundColor: '#f1f5f9', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#e2e8f0',
  },
  securityTitle: { fontSize: 11, fontWeight: 'bold', color: '#334155', marginBottom: 4 },
  securityText: { fontSize: 10, color: '#64748b', lineHeight: 15 },
});
