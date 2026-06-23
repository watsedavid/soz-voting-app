import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const STREAM_URL = 'https://www.youtube.com/embed/5qap5aO4i9A';

export default function LiveScreen() {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: STREAM_URL }}
        style={styles.webview}
        allowsFullscreenVideo
        javaScriptEnabled
        mediaPlaybackRequiresUserAction={false}
      />
      <View style={styles.footer}>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>● LIVE</Text>
        </View>
        <Text style={styles.footerTitle}>Embedded Stream Player</Text>
        <Text style={styles.footerSub}>Stars of Zion Live Broadcast</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  webview: { flex: 1 },
  footer: { padding: 20, alignItems: 'center' },
  liveBadge: { backgroundColor: '#dc2626', borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10 },
  liveBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  footerTitle: { color: '#94a3b8', fontSize: 12, fontFamily: 'monospace', marginBottom: 4 },
  footerSub: { color: '#475569', fontSize: 10, fontFamily: 'monospace' },
});
