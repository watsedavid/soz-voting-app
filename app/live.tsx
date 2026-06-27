import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { supabase } from '../lib/supabase';

export default function LiveScreen() {
  const [videoId, setVideoId] = useState('');
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const fetchStream = async () => {
      const { data } = await supabase
        .from('settings')
        .select('youtube_live_url')
        .eq('id', 'global')
        .single();

      if (data) {
        const url = data.youtube_live_url;
        const match = url.match(/(?:embed\/|watch\?v=|live\/|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (match) setVideoId(match[1]);
      }
      setLoading(false);
    };
    fetchStream();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="#ffffff" size="large" style={{ flex: 1 }} />
      ) : videoId ? (
        <View style={styles.playerContainer}>
          <YoutubePlayer
            height={250}
            play={playing}
            videoId={videoId}
            onChangeState={(state) => {
              if (state === 'ended') setPlaying(false);
            }}
          />
        </View>
      ) : (
        <View style={styles.noStream}>
          <Text style={styles.noStreamText}>No stream available</Text>
        </View>
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
  playerContainer: { width: '100%', marginTop: 80 },
  noStream: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  noStreamText: { color: '#64748b', fontSize: 14 },
  footer: { padding: 20, alignItems: 'center' },
  liveBadge: { backgroundColor: '#dc2626', borderRadius: 4, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 10 },
  liveBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  footerTitle: { color: '#94a3b8', fontSize: 12 },
});
