import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, Alert, Switch, ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';

type Tab = 'rankings' | 'nominees' | 'payments';

type Contestant = {
  id: string;
  name: string;
  vote_count: number;
  is_active: boolean;
};

type Vote = {
  id: string;
  contestant_id: string;
  amount_paid: number;
  votes_purchased: number;
  transaction_ref: string;
  payment_status: string;
  voter_email: string;
};

export default function AdminScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('rankings');
  const [votingActive, setVotingActive] = useState(true);
  const [streamUrl, setStreamUrl] = useState('');
  const [contestants, setContestants] = useState<Contestant[]>([]);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  const totalVotes = contestants.reduce((sum, c) => sum + c.vote_count, 0);

  const fetchData = async () => {
    setDataLoading(true);
    const { data: c } = await supabase
      .from('contestants')
      .select('*')
      .order('vote_count', { ascending: false });

    const { data: v } = await supabase
      .from('votes')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: s } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 'global')
      .single();

    if (c) setContestants(c);
    if (v) setVotes(v);
    if (s) {
      setVotingActive(s.voting_active);
      setStreamUrl(s.youtube_live_url);
    }
    setDataLoading(false);
  };

  const handleLogin = async () => {
    setAuthError('');
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email.trim())
        .eq('password_hash', password.trim())
        .single();

      if (data) {
        setToken('jwt_active_' + data.id);
        await fetchData();
      } else {
        setAuthError('Invalid email or password.');
      }
    } catch (e) {
      setAuthError('Invalid email or password.');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
    setEmail('');
    setPassword('');
  };

  const handleToggleVoting = async (value: boolean) => {
    setVotingActive(value);
    await supabase
      .from('settings')
      .update({ voting_active: value })
      .eq('id', 'global');
  };

  const handleUpdateStream = async () => {
    await supabase
      .from('settings')
      .update({ youtube_live_url: streamUrl })
      .eq('id', 'global');
    Alert.alert('Updated', 'Live stream URL updated successfully.');
  };

  const handleDisable = (id: string) => {
    Alert.alert('Disable Contestant', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Disable', style: 'destructive',
        onPress: async () => {
          await supabase
            .from('contestants')
            .update({ is_active: false })
            .eq('id', id);
          setContestants(prev => prev.map(c => c.id === id ? { ...c, is_active: false } : c));
        },
      },
    ]);
  };

  if (!token) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.loginCard}>
          <Text style={styles.loginIcon}>🔐</Text>
          <Text style={styles.loginTitle}>Admin Login</Text>
          {!!authError && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {authError}</Text>
            </View>
          )}
          <Text style={styles.fieldLabel}>EMAIL</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholder="Enter admin email"
            placeholderTextColor="#94a3b8"
          />
          <Text style={styles.fieldLabel}>PASSWORD</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter password"
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity
            style={[styles.loginBtn, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginBtnText}>Authorize Session</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.adminHeader}>
        <View>
          <Text style={styles.adminHeaderTitle}>✅ Console Authorized</Text>
          <Text style={styles.adminHeaderSub}>{email}</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controlCard}>
        <Text style={styles.controlCardLabel}>VOTING STATE</Text>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleStatus, votingActive ? { color: '#10b981' } : { color: '#94a3b8' }]}>
            {votingActive ? 'ACTIVE' : 'CLOSED'}
          </Text>
          <Switch
            value={votingActive}
            onValueChange={handleToggleVoting}
            trackColor={{ false: '#e2e8f0', true: '#bbf7d0' }}
            thumbColor={votingActive ? '#10b981' : '#94a3b8'}
          />
        </View>
      </View>

      <View style={styles.controlCard}>
        <Text style={styles.controlCardLabel}>YOUTUBE STREAM URL</Text>
        <TextInput
          style={styles.streamInput}
          value={streamUrl}
          onChangeText={setStreamUrl}
          placeholder="https://www.youtube.com/embed/..."
          placeholderTextColor="#94a3b8"
        />
        <TouchableOpacity style={styles.updateBtn} onPress={handleUpdateStream}>
          <Text style={styles.updateBtnText}>Update Stream</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {(['rankings', 'nominees', 'payments'] as Tab[]).map((t) => (
          <TouchableOpacity key={t} style={[styles.tabBtn, tab === t && styles.tabBtnActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabBtnText, tab === t && styles.tabBtnTextActive]}>
              {t === 'rankings' ? '📊' : t === 'nominees' ? '👥' : '💳'} {t}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {dataLoading ? (
        <ActivityIndicator color="#2563eb" size="large" style={{ marginTop: 20 }} />
      ) : (
        <View style={styles.tabContent}>
          {tab === 'rankings' && (
            <>
              <View style={styles.rankHeader}>
                <Text style={styles.rankTitle}>Live Rankings</Text>
                <View style={styles.totalBox}>
                  <Text style={styles.totalBoxLabel}>TOTAL</Text>
                  <Text style={styles.totalBoxNum}>{totalVotes.toLocaleString()}</Text>
                </View>
              </View>
              {contestants.map((c, i) => {
                const pct = totalVotes > 0 ? (c.vote_count / totalVotes) * 100 : 0;
                return (
                  <View key={c.id} style={styles.rankCard}>
                    <Text style={styles.rankNum}>#{i + 1}</Text>
                    <View style={styles.rankAvatar}>
                      <Text style={styles.rankAvatarText}>{c.name[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.rankName}>{c.name}</Text>
                      <View style={styles.barBg}>
                        <View style={[styles.barFill, { width: `${pct}%` }]} />
                      </View>
                      <Text style={styles.rankPct}>{pct.toFixed(1)}%</Text>
                    </View>
                    <Text style={styles.rankCount}>{c.vote_count}</Text>
                  </View>
                );
              })}
            </>
          )}

          {tab === 'nominees' && (
            <>
              <Text style={styles.rankTitle}>Contestants Registry</Text>
              {contestants.map((c) => (
                <View key={c.id} style={styles.nomineeCard}>
                  <View style={styles.rankAvatar}>
                    <Text style={styles.rankAvatarText}>{c.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.nomineeName}>{c.name}</Text>
                    <Text style={styles.nomineeId}>{c.vote_count} votes</Text>
                  </View>
                  <View style={[styles.statusBadge, c.is_active ? styles.statusActive : styles.statusHidden]}>
                    <Text style={[styles.statusText, { color: c.is_active ? '#10b981' : '#ef4444' }]}>
                      {c.is_active ? 'Active' : 'Hidden'}
                    </Text>
                  </View>
                  {c.is_active && (
                    <TouchableOpacity style={styles.disableBtn} onPress={() => handleDisable(c.id)}>
                      <Text style={styles.disableBtnText}>Disable</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </>
          )}

          {tab === 'payments' && (
            <>
              <Text style={styles.rankTitle}>Transaction Registry</Text>
              {votes.length === 0 ? (
                <Text style={styles.emptyText}>No transactions yet.</Text>
              ) : (
                votes.map((v) => (
                  <View key={v.id} style={styles.paymentCard}>
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentRef}>{v.transaction_ref}</Text>
                      <View style={styles.successBadge}>
                        <Text style={styles.successBadgeText}>{v.payment_status.toUpperCase()}</Text>
                      </View>
                    </View>
                    <View style={styles.paymentRow}>
                      <Text style={styles.paymentDetail}>{v.votes_purchased} votes · {v.voter_email}</Text>
                      <Text style={styles.paymentAmount}>₦{v.amount_paid.toLocaleString()}</Text>
                    </View>
                  </View>
                ))
              )}
            </>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, gap: 14 },
  loginCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  loginIcon: { fontSize: 32, textAlign: 'center', marginBottom: 10 },
  loginTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', textAlign: 'center' },
  loginSub: { fontSize: 11, color: '#64748b', textAlign: 'center', marginBottom: 20 },
  errorBox: { backgroundColor: '#fef2f2', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#fecaca', marginBottom: 12 },
  errorText: { fontSize: 11, color: '#dc2626' },
  fieldLabel: { fontSize: 9, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#0f172a', marginBottom: 14 },
  loginBtn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  loginBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  adminHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  adminHeaderTitle: { fontWeight: 'bold', fontSize: 13, color: '#0f172a' },
  adminHeaderSub: { fontSize: 10, color: '#64748b' },
  logoutBtn: { borderWidth: 1, borderColor: '#fecaca', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 },
  logoutBtnText: { fontSize: 11, fontWeight: 'bold', color: '#ef4444' },
  controlCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  controlCardLabel: { fontSize: 9, fontWeight: 'bold', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleStatus: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
  streamInput: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 11, color: '#0f172a', marginBottom: 8 },
  updateBtn: { backgroundColor: '#2563eb', borderRadius: 8, paddingVertical: 8, alignItems: 'center' },
  updateBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  tabRow: { flexDirection: 'row', gap: 8 },
  tabBtn: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 10, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  tabBtnActive: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  tabBtnText: { fontSize: 9, fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase' },
  tabBtnTextActive: { color: '#ffffff' },
  tabContent: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', gap: 12 },
  rankHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  rankTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a' },
  totalBox: { backgroundColor: '#f8fafc', borderRadius: 10, padding: 10, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'flex-end' },
  totalBoxLabel: { fontSize: 8, color: '#94a3b8', fontWeight: 'bold', letterSpacing: 1 },
  totalBoxNum: { fontSize: 16, fontWeight: 'bold', color: '#2563eb' },
  rankCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  rankNum: { fontSize: 14, fontWeight: 'bold', color: '#94a3b8', width: 24 },
  rankAvatar: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  rankAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  rankName: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  barBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 99, overflow: 'hidden', marginBottom: 2 },
  barFill: { height: 6, backgroundColor: '#2563eb', borderRadius: 99 },
  rankPct: { fontSize: 9, color: '#2563eb' },
  rankCount: { fontSize: 14, fontWeight: 'bold', color: '#0f172a' },
  nomineeCard: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  nomineeName: { fontSize: 12, fontWeight: 'bold', color: '#0f172a' },
  nomineeId: { fontSize: 9, color: '#94a3b8' },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, borderWidth: 1 },
  statusActive: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  statusHidden: { backgroundColor: '#fef2f2', borderColor: '#fecaca' },
  statusText: { fontSize: 9, fontWeight: 'bold' },
  disableBtn: { borderWidth: 1, borderColor: '#fecaca', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  disableBtnText: { fontSize: 9, fontWeight: 'bold', color: '#ef4444' },
  paymentCard: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#e2e8f0', gap: 6 },
  paymentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  paymentRef: { fontSize: 11, fontWeight: 'bold', color: '#2563eb' },
  successBadge: { backgroundColor: '#f0fdf4', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1, borderColor: '#bbf7d0' },
  successBadgeText: { fontSize: 8, fontWeight: 'bold', color: '#10b981' },
  paymentDetail: { fontSize: 10, color: '#64748b' },
  paymentAmount: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  emptyText: { fontSize: 12, color: '#94a3b8', textAlign: 'center', paddingVertical: 20 },
});
