import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Modal, Alert, ActivityIndicator,
} from 'react-native';

const CONTESTANTS = [
  {
    id: 'c1',
    name: 'Sophia Adebayo',
    bio: 'Vocal powerhouse and performing artist representing Lagos. Passionate about afro-soul revival.',
  },
  {
    id: 'c2',
    name: 'David Chinedu',
    bio: 'Innovative digital media designer and multi-talented drummer bridging modern tech with heritage.',
  },
  {
    id: 'c3',
    name: 'Amina Bello',
    bio: 'Award-winning spoken word poet, activist, and creative writer dedicated to social narrative change.',
  },
  {
    id: 'c4',
    name: 'Emeka Okafor',
    bio: 'Classical-contemporary violinist blending African strings with orchestral masterpieces.',
  },
];

const PRICE_PER_VOTE = 200;

type Contestant = typeof CONTESTANTS[0];

export default function VoteScreen() {
  const [selected, setSelected] = useState<Contestant | null>(null);
  const [voteQty, setVoteQty] = useState(5);
  const [screen, setScreen] = useState<'list' | 'checkout' | 'success'>('list');
  const [loading, setLoading] = useState(false);
  const [ref] = useState('REF_' + Math.random().toString(36).substr(2, 9).toUpperCase());

  const total = voteQty * PRICE_PER_VOTE;

  const handleProceed = () => {
    if (!selected) return;
    setScreen('checkout');
  };

  const handleConfirmPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setScreen('success');
    }, 2000);
  };

  const handleReset = () => {
    setSelected(null);
    setVoteQty(5);
    setScreen('list');
  };

  // SUCCESS SCREEN
  if (screen === 'success' && selected) {
    return (
      <View style={styles.centerScreen}>
        <View style={styles.successIcon}>
          <Text style={{ fontSize: 36 }}>✅</Text>
        </View>
        <View style={styles.successBadge}>
          <Text style={styles.successBadgeText}>PAYMENT VERIFIED</Text>
        </View>
        <Text style={styles.successTitle}>Transaction Confirmed</Text>
        <Text style={styles.successSub}>
          Your purchase completed successfully. Webhook transaction verified.
        </Text>
        <View style={styles.successCard}>
          <Row label="Contestant:" value={selected.name} />
          <Row label="Votes Credited:" value={`+${voteQty} Votes`} valueColor="#10b981" />
          <Row label="Ref Code:" value={ref} valueColor="#2563eb" mono />
          <Row label="Gateway Status:" value="SUCCESS" valueColor="#10b981" />
        </View>
        <Text style={styles.thankYou}>"Thank you for backing your choice!"</Text>
        <TouchableOpacity style={styles.backBtn} onPress={handleReset}>
          <Text style={styles.backBtnText}>Back to Contestants</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // CHECKOUT SCREEN
  if (screen === 'checkout' && selected) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.checkoutHeader}>💳 PAYSTACK SANDBOX SIMULATION</Text>
        <Text style={styles.checkoutMerchant}>PAYMENT SECURED FOR MERCHANT</Text>
        <Text style={styles.checkoutTitle}>Stars of Zion Platform</Text>

        <View style={styles.checkoutCard}>
          <Row label="Contestant:" value={selected.name} />
          <Row label="Quantity:" value={`${voteQty} Votes`} />
          <Row label="Email:" value="voter@soz.com" />
          <Row label="Reference:" value={ref} valueColor="#2563eb" mono />
        </View>

        <Text style={styles.checkoutAmountLabel}>TOTAL TRANSACTION AMOUNT (NGN)</Text>
        <Text style={styles.checkoutAmount}>₦{total.toLocaleString()}</Text>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ <Text style={{ fontWeight: 'bold' }}>Sandbox Mode:</Text> Tapping confirm simulates a verified Paystack webhook call.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, loading && { opacity: 0.6 }]}
          onPress={handleConfirmPayment}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.confirmBtnText}>Simulate Success (Authorize)</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn} onPress={handleReset}>
          <Text style={styles.cancelBtnText}>Cancel Payment</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // CONTESTANT LIST + DRAWER
  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        <View style={styles.listHeader}>
          <Text style={styles.sectionLabel}>CONTESTANTS LIST</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{CONTESTANTS.length} Nominees</Text>
          </View>
        </View>

        {CONTESTANTS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.contestantCard}
            onPress={() => setSelected(item)}
          >
            <View style={styles.contestantAvatar}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contestantName}>{item.name}</Text>
              <Text style={styles.contestantBio} numberOfLines={1}>{item.bio}</Text>
            </View>
            <View style={styles.voteBadge}>
              <Text style={styles.voteBadgeText}>VOTE</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Drawer Modal */}
      <Modal visible={!!selected} transparent animationType="slide">
        <TouchableOpacity style={styles.overlay} onPress={() => setSelected(null)} activeOpacity={1} />
        {selected && (
          <View style={styles.drawer}>
            <View style={styles.drawerHandle} />

            <View style={styles.drawerHeader}>
              <View style={styles.drawerAvatar}>
                <Text style={styles.drawerAvatarText}>{selected.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.drawerIdText}>ID: {selected.id}</Text>
                <Text style={styles.drawerName}>{selected.name}</Text>
                <Text style={styles.drawerPrice}>₦200 = 1 Vote</Text>
              </View>
            </View>

            <Text style={styles.drawerBio}>{selected.bio}</Text>

            {/* Vote Qty */}
            <View style={styles.qtyRow}>
              <Text style={styles.qtyLabel}>Total Votes:</Text>
              <View style={styles.qtyControls}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => voteQty > 1 && setVoteQty(voteQty - 1)}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNum}>{voteQty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => setVoteQty(voteQty + 1)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Price Per Vote:</Text>
              <Text style={styles.priceValue}>₦200</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal Amount:</Text>
              <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
            </View>

            <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
              <Text style={styles.proceedBtnText}>Proceed to Payment (₦{total.toLocaleString()})</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </View>
  );
}

function Row({ label, value, valueColor, mono }: { label: string; value: string; valueColor?: string; mono?: boolean }) {
  return (
    <View style={rowStyles.row}>
      <Text style={rowStyles.label}>{label}</Text>
      <Text style={[rowStyles.value, valueColor ? { color: valueColor } : {}, mono ? { fontFamily: 'monospace' } : {}]}>
        {value}
      </Text>
    </View>
  );
}

const rowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 11, color: '#64748b' },
  value: { fontSize: 11, fontWeight: 'bold', color: '#0f172a' },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, gap: 12 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  sectionLabel: { color: '#64748b', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  countBadge: { backgroundColor: '#e2e8f0', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 2 },
  countBadgeText: { fontSize: 9, fontWeight: 'bold', color: '#475569', fontFamily: 'monospace' },
  contestantCard: {
    backgroundColor: '#ffffff', borderRadius: 14, padding: 12,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    borderWidth: 1, borderColor: '#e2e8f0',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  contestantAvatar: {
    width: 48, height: 48, borderRadius: 10,
    backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  contestantName: { fontWeight: 'bold', fontSize: 13, color: '#0f172a' },
  contestantBio: { fontSize: 10, color: '#64748b', marginTop: 2 },
  voteBadge: {
    backgroundColor: '#eff6ff', borderRadius: 6, paddingHorizontal: 10,
    paddingVertical: 5, borderWidth: 1, borderColor: '#bfdbfe',
  },
  voteBadgeText: { fontSize: 9, fontWeight: 'bold', color: '#2563eb' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  drawer: {
    backgroundColor: '#ffffff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 20, paddingBottom: 36, maxHeight: '80%',
  },
  drawerHandle: { width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 99, alignSelf: 'center', marginBottom: 16 },
  drawerHeader: { flexDirection: 'row', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  drawerAvatar: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center' },
  drawerAvatarText: { color: '#fff', fontWeight: 'bold', fontSize: 24 },
  drawerIdText: { fontSize: 9, color: '#94a3b8', fontFamily: 'monospace', marginBottom: 2 },
  drawerName: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  drawerPrice: { fontSize: 10, color: '#64748b', marginTop: 2 },
  drawerBio: { fontSize: 11, color: '#64748b', lineHeight: 17, marginBottom: 16 },
  qtyRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#f8fafc', borderRadius: 10, padding: 10,
    borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 10,
  },
  qtyLabel: { fontSize: 12, fontWeight: 'bold', color: '#334155' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  qtyBtn: {
    width: 30, height: 30, borderRadius: 8, backgroundColor: '#ffffff',
    borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  qtyNum: { fontSize: 16, fontWeight: 'bold', color: '#2563eb', fontFamily: 'monospace', minWidth: 24, textAlign: 'center' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  priceLabel: { fontSize: 12, color: '#64748b' },
  priceValue: { fontSize: 12, color: '#475569', fontFamily: 'monospace' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10, marginBottom: 16 },
  totalLabel: { fontSize: 13, fontWeight: 'bold', color: '#0f172a' },
  totalValue: { fontSize: 18, fontWeight: 'bold', color: '#10b981', fontFamily: 'monospace' },
  proceedBtn: { backgroundColor: '#10b981', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  proceedBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  // Checkout
  checkoutHeader: { fontSize: 10, fontWeight: 'bold', color: '#0d9488', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
  checkoutMerchant: { fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center' },
  checkoutTitle: { fontSize: 15, fontWeight: 'bold', color: '#0f172a', textAlign: 'center', textTransform: 'uppercase', marginBottom: 16 },
  checkoutCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  checkoutAmountLabel: { fontSize: 9, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 2, textAlign: 'center', marginBottom: 4 },
  checkoutAmount: { fontSize: 28, fontWeight: 'bold', color: '#0f172a', fontFamily: 'monospace', textAlign: 'center', marginBottom: 16 },
  warningBox: { backgroundColor: '#fffbeb', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: '#fde68a', marginBottom: 16 },
  warningText: { fontSize: 10, color: '#92400e', lineHeight: 15 },
  confirmBtn: { backgroundColor: '#16a34a', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  confirmBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
  cancelBtn: { backgroundColor: '#ffffff', borderRadius: 12, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  cancelBtnText: { color: '#64748b', fontWeight: '600', fontSize: 12 },
  // Success
  centerScreen: { flex: 1, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', padding: 24 },
  successIcon: { width: 72, height: 72, borderRadius: 99, backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  successBadge: { backgroundColor: '#f0fdf4', borderRadius: 99, paddingHorizontal: 14, paddingVertical: 5, borderWidth: 1, borderColor: '#bbf7d0', marginBottom: 14 },
  successBadgeText: { fontSize: 9, fontWeight: 'bold', color: '#10b981', letterSpacing: 1 },
  successTitle: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  successSub: { fontSize: 12, color: '#64748b', textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  successCard: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0', width: '100%', marginBottom: 16 },
  thankYou: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginBottom: 24 },
  backBtn: { backgroundColor: '#2563eb', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32, alignItems: 'center' },
  backBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 13 },
});
