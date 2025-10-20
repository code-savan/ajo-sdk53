import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { ChevronLeft, Send } from 'lucide-react-native';

export default function SupportTicketScreen({ navigation }: any) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSubmitting(true);
    try {
      // UI-only for now
      setTimeout(() => {
        setSubmitting(false);
        navigation.goBack();
      }, 600);
    } finally {}
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#000" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Support</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text style={styles.subtitle}>Send us a message and we'll get back to you shortly.</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Subject</Text>
          <View style={styles.inputWrap}>
            <TextInput value={subject} onChangeText={setSubject} placeholder="Describe your issue" style={styles.input} />
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Message</Text>
          <View style={[styles.inputWrap, { minHeight: 140 }] }>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Provide details to help us assist you"
              style={[styles.input, { height: 120 }]}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.submitBtn, (!subject.trim()||!message.trim()) && {opacity:0.5} ]} disabled={!subject.trim()||!message.trim()||submitting} onPress={handleSubmit}>
          <Send color="#fff" size={18} />
          <Text style={styles.submitText}>{submitting? 'Sending…':'Send ticket'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  backBtn: { padding: 4, marginRight: 8 },
  headerTitle: { fontSize: 16, fontWeight: '500', color: '#1E1E1E' },
  subtitle: { fontSize: 12, color: '#928F8B', marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { fontSize: 12, color: '#4D4845', marginBottom: 8 },
  inputWrap: { backgroundColor: '#F2F2F2', borderRadius: 12, borderWidth: 1, borderColor: '#DCDCDC', paddingHorizontal: 12, paddingVertical: 12 },
  input: { fontSize: 12, color: '#000', fontWeight: '400' },
  footer: { padding: 16, borderTopWidth: 1, borderColor: '#F2F2F2' },
  submitBtn: { backgroundColor: '#000', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent:'center', flexDirection: 'row', gap: 8 },
  submitText: { color: '#fff', fontSize: 14, fontWeight: '500', marginLeft: 6 },
});
