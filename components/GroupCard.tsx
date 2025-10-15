import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, Users, DollarSign } from 'lucide-react-native';

interface GroupCardProps {
  group: any;
  onPress: () => void;
}

export default function GroupCard({ group, onPress }: GroupCardProps) {
  const goal = group?.goal_amount_cents ? (Number(group.goal_amount_cents)/100).toLocaleString('en-US',{style:'currency',currency:(group.currency||'USD').toUpperCase()}) : '';
  const freqRaw = String(group?.frequency || '').toLowerCase();
  const freqAbbr = freqRaw.includes('month') || freqRaw === 'mnth' ? 'M'
    : freqRaw.includes('week') ? 'W'
    : freqRaw.includes('day') ? 'D'
    : freqRaw.includes('biweek') ? 'BW'
    : freqRaw.includes('quarter') ? 'Q'
    : freqRaw.includes('year') ? 'Y'
    : (freqRaw ? freqRaw.charAt(0).toUpperCase() : '');
  const contrib = group?.contribution_amount_cents ? `${(Number(group.contribution_amount_cents)/100).toLocaleString('en-US',{style:'currency',currency:(group.currency||'USD').toUpperCase()})}${freqAbbr ? ` / ${freqAbbr}` : ''}` : '-';
  const created = group?.created_at ? new Date(group.created_at).toLocaleDateString() : (group?.next_charge_at ? new Date(group.next_charge_at).toLocaleDateString() : '-');
  const size = group?.size || 0;

  return (
    <TouchableOpacity style={styles.groupItem} onPress={onPress}>
      <View style={styles.groupContent}>
        <View style={styles.groupIcon}>
          <View style={styles.groupIconBg}>
            <View style={styles.iconBadge}>
              <Text style={styles.iconBadgeText}>{String(size)}</Text>
            </View>
          </View>
        </View>
        <View style={styles.groupInfo}>
          <Text style={styles.groupTitle}>{group?.name}</Text>
          {!!goal && <Text style={styles.groupAmount}>{goal}</Text>}
          <View style={styles.groupMeta}>
            <View style={styles.metaItem}>
              <Calendar width={16} height={16} color="#2563eb" />
              <Text style={styles.metaText}>{created}</Text>
            </View>
            <View style={styles.metaItem}>
              <Users width={16} height={16} color="#2563eb" />
              <Text style={styles.metaText}>{String(size)}</Text>
            </View>
            <View style={styles.metaItem}>
              <DollarSign width={16} height={16} color="#2563eb" />
              <Text style={styles.metaText}>{contrib}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  groupItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  groupContent: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  groupIcon: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  groupIconBg: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0f2e9',
    borderRadius: 8,
    position: 'relative',
    borderWidth: 0.5,
    borderColor: '#c2d6b8',
  },
  iconBadge: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -15,
    marginLeft: -15,
    width: 30,
    height: 30,
    backgroundColor: '#e7c08c',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  iconBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  groupInfo: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  groupTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 4,
  },
  groupAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9A9AA0',
    marginBottom: 12,
  },
  groupMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#4D4845',
    fontWeight: '400',
  },
});
