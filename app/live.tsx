import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { supabase } from '../lib/supabase';

export default function LiveScreen() {
  const [streamUrl, setStreamUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      const { data } = await supabase
        .from('settings')
        .select('youtube_live_url')
        .eq('id', 'global')
        .single();

      if (data) setStreamUrl(data.youtube_live_url);
      setLoading(false);
    };
    fetchStream();
  }, []);

  const embedHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; }
    body { background: #000; }
    iframe { width: 100vw; height: 100vh; border: none; }
  </style>
</head>
<body>
  <iframe 
    src="${streamUrl}?autoplay=1&playsinline=1&rel=0"
    allow="autoplay; fullscreen; encrypted-media"
    allowfullscreen
  ></iframe>
</body>
</html>
`;

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="#ffffff" size="large" style={{ flex: 1 }} />
      ) : (
        <WebView
          source={{ html: embedHtml }}
          style={styles.webview}
          allowsFullscreenVideo
          javaScriptEnabled
          domStorageEnabled
          mediaPlaybackRequiresUserAction={false}
          userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
        />
      )}
      <View style={styles.footer}>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>● LIVE</Text>
        </View>
        <Text style={styles.footerTitle}>Stars of Zion Live Broadcast</Text>
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
  footerTitle: { color: '#94a3b8', fontSize: 12 },
});
