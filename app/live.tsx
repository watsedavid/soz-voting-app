import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { supabase } from '../lib/supabase';

export default function LiveScreen() {
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      const { data } = await supabase
        .from('settings')
        .select('youtube_live_url')
        .eq('id', 'global')
        .single();

      if (data) {
        const url = data.youtube_live_url;
        const match = url.match(/(?:embed\/|watch\?v=|live\/)([a-zA-Z0-9_-]{11})/);
        if (match) setVideoId(match[1]);
      }
      setLoading(false);
    };
    fetchStream();
  }, []);

  const embedHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; background: #000; overflow: hidden; }
    #player { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="player"></div>
  <script>
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;
    function onYouTubeIframeAPIReady() {
      player = new YT.Player('player', {
        videoId: '${videoId}',
        playerVars: {
          autoplay: 1,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          controls: 1,
          fs: 1,
          origin: 'https://www.youtube.com'
        },
        events: {
          onReady: function(e) { e.target.playVideo(); }
        }
      });
    }
  </script>
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
          allowsInlineMediaPlayback
          userAgent="Mozilla/5.0 (Linux; Android 10; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36"
          originWhitelist={['*']}
          mixedContentMode="always"
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
