import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Alert, Switch,
} from 'react-native';

const MOCK_RANKINGS = [
  { id: 'c3', name: 'Amina Bello', voteCount: 2110, isActive: true },
  { id: 'c1', name: 'Sophia Adebayo', voteCount: 1450, isActive: true },
  { id: 'c2', name: 'David Chinedu', voteCount: 980, isActive: true },
  { id: 'c4', name: 'Emeka Okafor', voteCount: 750, isActive: true },
];

const MOCK_PAYMENTS = [
  { id: 'v1', contestantId: 'c1', amountPaid: 4000, votesPurchased: 20, transactionRef: 'REF_TEST_1001', paymentStatus: 'success', voterEmail: 'voter1@test.com', createdAt: new Date().toISOString() },
  { id: 'v2', contestantId: 'c3', amountPaid: 10000, votesPurchased: 50, transactionRef: 'REF_TEST_1002', paymentStatus: 'success', voterEmail: 'voter2@test.com', createdAt: new Date().toISOString() },
];

type Tab = 'rankings' | 'nominees' | 'payments';

export default function AdminScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('admin@voting.com');
  const [password, setPassword] = useState('admin123');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('rankings');
  const [votingActive, setVotingActive] = useState(true);
  const [streamUrl, setStreamUrl] = useState('https://www.youtube.com/embed/5qap5aO4i9A');
  const [rankings, setRankings] = useState(MOCK_RANKINGS);

  const totalVotes = rankings.reduce((sum, c) => sum + c.voteCount, 0);

  const handleLogin = () => {
    setAuthError('');
    setLoading(true);
    setTimeout(() => {
      if (email === 'admin@voting.com' && password === 'admin123') {
        setToken('jwt_mock_token_active');
      } else {
        setAuthError('Invalid credentials. Use mock credentials below.');
      }
      setLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    setToken(null);
    setEmail('admin@voting.com');
    setPassword('admin123');
  };

  const handleDisable = (id: string) => {
    Alert.alert('Disable Contestant', 'Are you sure? They will be hidden from voters.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disable', style: 'destructive',
        onPress: () => setRankings(prev => prev.map(c => c.id === id ? { ...c, isActive: false } : c)),
      },
    ]);
  };

  // LOGIN SCREEN
  if (!token) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.loginCard}>
          <Text style={styles.loginIcon}>🔐</Text>
          <Text style={styles.loginTitle}>Admin Login Controller</Text>
          <Text style={styles.loginSub}>JWT Protected Management Realm</Text>

          {!!authError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {authError}</Text>
            </View>
          )}

          <Text style={styles.fieldLabel}>EMAIL COORDINATES</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#94a3b8"
          />

          <Text style={styles.fieldLabel}>AUTHORIZATION PASSWORD</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#94a3b8"
          />

          <View style={styles.credBox}>
            <Text style={styles.credTitle}>⚡ MOCK DEV CREDENTIALS</Text>
            <Text style={styles.credText}>Email: <Text style={styles.credHighlight}>admin@voting.com</Text></Text>
            <Text style={styles.credText}>Password: <Text style={styles.credHighlight}>admin123</Text></Text>
          </View>

          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? 'Generating JWT Token...' : 'Authorize Administrative Session'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  // ADMIN DASHBOARD
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={styles.adminHeader}>
        <View>
          <Text style={styles.adminHeaderTitle}>✅ Console Authorized</Text>
          <Text style={styles.adminHeaderSub}>{email} (JWT ACTIVE)</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controlsGrid}>
        <View style={styles.controlCard}>
          <Text style={styles.controlCardLabel}>VOTING STATE</Text>
          <Text style={styles.controlCardTitle}>Session Gate-Keeper</Text>
          <Text style={styles.controlCardSub}>Disabling blocks all checkouts instantly.</Text>
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleStatus, votingActive ? { color: '#10b981' } : { color: '#94a3b8' }]}>
              {votingActive ? 'ACTIVE' : 'CLOSED'}
            </Text>
            <Switch
              value={votingActive}
              onValueChange={setVotingActive}
              trackColor={{ false: '#e2e8f0', true: '#bbf7d0' }}
              thumbColor={votingActive ? '#10b981' : '#94a3b8'}
            />
          </View>
        </View>

        <View style={styles.controlCard}>
          <Text style={styles.controlCardLabel}>BROADCASTER FEED</Text>
          <Text style={styles.controlCardTitle}>YouTube Stream URL</Text>
          <TextInput
            style={styles.streamInput}
            value={streamUrl}
            onChangeText={setStreamUrl}
            placeholder="https://www.youtube.com/embed/..."
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => Alert.alert('Updated', 'Live stream URL updated successfully.')}
          >
            <Text style={styles.updateBtnText}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(['rankings', 'nominees', 'payments'] as Tab[]).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabBtnText, tab === t && styles.tabBtnTextActive]}>
              {t === 'rankings' ? '📊 Rankings' : t === 'nominees' ? '👥 Nominees' : '💳 Payments'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* RANKINGS TAB */}
      {tab === 'rankings' && (
        <View style={styles.tabContent}>
          <View style={styles.rankHeader}>
            <View>
              <Text style={styles.rankTitle}>Real-Time Standings</Text>
              <Text style={styles.rankSub}>Hidden from public. Admin only.</Text>
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.totalBoxLabel}>TOTAL VOTES</Text>
              <Text style={styles.totalBoxNum}>{totalVotes.toLocaleString()}</Text>
            </View>
          </View>

          {rankings.map((c, i) => {
            const pct = totalVotes > 0 ? (c.voteCount / totalVotes) * 100 : 0;
            return (
              <View key={c.id} style={styles.rankCard}>
                <Text style={styles.rankNum}>#{i + 1}</Text>
                <View style={styles.rankAvatarSmall}>
                  <Text style={styles.rankAvatarText}>{c.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rankName}>{c.name}</Text>
                  <View style={styles.barBg}>
                    <View style={[styles.barFill, { width: `${pct}%` }]} />
                  </View>
                  <Text style={styles.rankPct}>{pct.toFixed(1)}% global share</Text>
                </View>
                <Text style={styles.rankCount}>{c.voteCount.toLocaleString()}</Text>
              </View>
            );
          })}
        </View>
      )}

      {/* NOMINEES TAB */}
      {tab === 'nominees' && (
        <View style={styles.tabContent}>
          <Text style={styles.rankTitle}>Contestants Registry</Text>
          <Text style={styles.rankSub}>Manage nominee registrations.</Text>
          {rankings.map((c) => (
            <View key={c.id} style={styles.nomineeCard}>
              <View style={styles.rankAvatarSmall}>
                <Text style={styles.rankAvatarText}>{c.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.nomineeName}>{c.name}</Text>
                <Text style={styles.nomineeId}>ID: {c.id}</Text>
              </View>
              <View style={[styles.statusBadge, c.isActive ? styles.statusActive : styles.statusHidden]}>
                <Text style={[styles.statusText, c.isActive ? { color: '#10b981' } : { color: '#ef4444' }]}>
                  {c.isActive ? 'Active' : 'Hidden'}
                </Text>
              </View>
              {c.isActive && (
                <TouchableOpacity style={styles.disableBtn} onPress={() => handleDisable(c.id)}>
                  <Text style={styles.disableBtnText}>Disable</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      )}

      {/* PAYMENTS TAB */}
      {tab === 'payments' && (
        <View style={styles.tabContent}>
          <Text style={styles.rankTitle}>Transaction Registry</Text>
          <Text style={styles.rankSub}>Audit log of all verified payments.</Text>
          {MOCK_PAYMENTS.map((p) => (
            <View key={p.id} style={styles.paymentCard}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentRef}>{p.transactionRef}</Text>
                <View style={styles.successBadge}>
                  <Text style={styles.successBadgeText}>{p.paymentStatus.toUpperCase()}</Text>
                </View>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentDetail}>{p.votesPurchased} votes · {p.voterEmail.split('@')[0]}</Text>
                <Text style={styles.paymentAmount}>₦{p.amountPaid.toLocaleString()}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, gap: 14 },
  // Login
  loginCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  loginIcon: { fontSize: 32, textAlign: 'center', marginBottom: 10 },
  loginTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  loginSub: { fontSize: 11, color: '#64748b', textAlign: 'center', marginBottom: 20 },
  errorBox: { backgroundColor: '#fef2f2', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#fecaca', marginBottom: 12 },
  errorText: { fontSize: 11, color: '#dc2626' },
  fieldLabel: { fontSize: 9, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#0f172a', marginBottom: 14 },
  credBox: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  credTitle: { fontSize: 10, fontWeight: 'bold', color: '#334155', marginBottom: 4 },
  credText: { fontSize: 11, color: '#64748b', fontFamily: 'monospace' },
  credHighlight: { color: '#2563eb', fontWeight: 'bold' },
  loginBtn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  loginBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  // Admin header
  adminHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  adminHeaderTitle: { fontWeight: 'bold', fontSize: 13, color: '#0f172a' },
  adminHeaderSub: { fontSize: 10, color: '#64748b', fontFamily: 'monospace' },
  logoutBtn: { borderWidth: 1, borderColor: '#fecaca', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  logoutBtnText: { fontSize: 11, fontWeight: 'bold', color: '#ef4444' },
  // Controls
  controlsGrid: { gap: 12 },
  controlCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  controlCardLabel: { fontSize: 9, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  controlCardTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  controlCardSub: { fontSize: 11, color: '#64748b', marginBottom: 10 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleStatus: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  streamInput: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 11, color: '#0f172a', marginBottom: 8 },
  updateBtn: { backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  updateBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  // Tabs
  tabRow: { flexDirection: 'row', gap: 8 },
  tabBtn: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 10, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  tabBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  tabBtnText: { fontSize: 9, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' },
  tabBtnTextActive: { color: '#ffffff' },
  tabContent: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', gap: 12 },
  // Rankings
  rankHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rankTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  rankSub: { fontSize: 10, color: '#64748b', marginTop: 2 },
  totalBox: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'flex-end' },
  totalBoxLabel: { fontSize: 8, color: '#94a3b8', fontWeight: 'bold', letterSpacing: 1 },
  totalBoxNum: { fontSize: 16, fontWeight: 'bold', color: '#2563eb', fontFamily: 'monospace' },
  rankCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  rankNum: { fontSize: 14, fontWeight: 'bold', color: '#94a3b8', width: 24 },
  rankAvatarSmall: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  rankAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  rankName: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  barBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 99, overflow: 'hidden', marginBottom: 2 },
  barFill: { height: 6, backgroundColor: '#2563eb', borderRadius: 99 },
  rankPct: { fontSize: 9, color: '#2563eb', fontFamily: 'monospace' },
  rankCount: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' },
  // Nominees
  nomineeCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  nomineeName: { fontSize: 12, fontWeight: 'bold', color: '#0f172a' },
  nomineeId: { fontSize: 9, color: '#94a3b8', fontFamily: 'monospace' },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  statusActive: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  statusHidden: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  statusText: { fontSize: 9, fontWeight: 'bold' },
  disableBtn: { borderWidth: 1, borderColor: '#fecaca', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  disableBtnText: { fontSize: 9, fontWeight: 'bold', color: '#ef4444' },
  // Payments
  paymentCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', gap: 6 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentRef: { fontSize: 11, fontWeight: 'bold', color: '#2563eb', fontFamily: 'monospace' },
  successBadge: { backgroundColor: '#f0fdf4', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: '#bbf7d0' },
  successBadgeText: { fontSize: 8, fontWeight: 'bold', color: '#10b981' },
  paymentDetail: { fontSize: 10, color: '#64748b' },
  paymentAmount: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace' },
});
