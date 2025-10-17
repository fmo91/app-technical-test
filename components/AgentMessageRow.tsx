import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import type { AgentMessage } from '../utils/chat/models/AgentMessage';

type AgentComponent = NonNullable<AgentMessage['content']['component']>;
type ContactBadgeMetadata = Extract<AgentComponent, { type: 'contact_badge' }>['metadata'];
type CalendarEventMetadata = Extract<AgentComponent, { type: 'calendar_event' }>['metadata'];

export default function AgentMessageRow({ item }: { item: AgentMessage }) {
  const { content } = item;

  return (
	<View style={styles.container}>
	  <View style={styles.bubble}>
		<Text style={styles.roleLabel}>{item.role.toUpperCase()}</Text>
		{content?.text ? <Text style={styles.message}>{content.text}</Text> : null}
		{content?.component ? renderComponent(content.component) : null}
	  </View>
	</View>
  );
}

function renderComponent(component: AgentComponent) {
  switch (component.type) {
	case 'contact_badge':
	  return <ContactBadge metadata={component.metadata ?? {}} />;
	case 'calendar_event':
	  return <CalendarEventCard metadata={component.metadata ?? {}} />;
	default:
	  return null;
  }
}

function ContactBadge({ metadata }: { metadata: ContactBadgeMetadata }) {
  const { name, email, company, profilePicture } = metadata ?? {};
  const showAvatar = typeof profilePicture === 'string' && profilePicture.length > 0;
  const initial = name ? name.trim().charAt(0).toUpperCase() : '?';

  return (
	<View style={styles.contactCard}>
	  {showAvatar ? (
		<Image source={{ uri: profilePicture }} style={styles.avatar} />
	  ) : (
		<View style={styles.avatarFallback}>
		  <Text style={styles.avatarFallbackText}>{initial}</Text>
		</View>
	  )}
	  <View style={styles.contactDetails}>
		{name ? <Text style={styles.contactName}>{name}</Text> : null}
		{company ? <Text style={styles.contactCompany}>{company}</Text> : null}
		{email ? <Text style={styles.contactEmail}>{email}</Text> : null}
	  </View>
	</View>
  );
}

function CalendarEventCard({ metadata }: { metadata: CalendarEventMetadata }) {
  const { title, date, time, status } = metadata ?? {};

  return (
	<View style={styles.eventCard}>
	  {title ? <Text style={styles.eventTitle}>{title}</Text> : null}
	  <View style={styles.eventMetaRow}>
		{date ? <Text style={styles.eventMeta}>{date}</Text> : null}
		{time ? <Text style={styles.eventMeta}>{time}</Text> : null}
	  </View>
	  {status ? (
		<View style={[styles.statusPill, statusPillStyles(status)]}>
		  <Text style={styles.statusText}>{status}</Text>
		</View>
	  ) : null}
	</View>
  );
}

function statusPillStyles(status: string) {
  switch (status) {
	case 'CONFIRMED':
	  return { backgroundColor: '#e0f8ea' };
	case 'CANCELLED':
	  return { backgroundColor: '#fde4e4' };
	default:
	  return { backgroundColor: '#fdf3d6' };
  }
}

const styles = StyleSheet.create({
  container: {
	paddingHorizontal: 16,
	paddingVertical: 8,
	alignItems: 'flex-start',
  },
  bubble: {
	maxWidth: '80%',
	backgroundColor: '#fff',
	paddingHorizontal: 16,
	paddingVertical: 12,
	borderRadius: 16,
	borderTopLeftRadius: 4,
	borderWidth: 1,
	borderColor: '#e0e0e0',
	shadowColor: '#000',
	shadowOpacity: 0.05,
	shadowOffset: { width: 0, height: 1 },
	shadowRadius: 2,
	elevation: 1,
  },
  roleLabel: {
	fontSize: 10,
	fontWeight: '600',
	color: '#6b6b6b',
	marginBottom: 4,
	textAlign: 'left',
  },
  message: {
	fontSize: 15,
	color: '#1a1a1a',
	marginBottom: 8,
  },
  contactCard: {
	flexDirection: 'row',
	alignItems: 'center',
	backgroundColor: '#f3f7ff',
	padding: 12,
	borderRadius: 12,
	marginTop: 4,
  },
  avatar: {
	width: 44,
	height: 44,
	borderRadius: 22,
	marginRight: 12,
  },
  avatarFallback: {
	width: 44,
	height: 44,
	borderRadius: 22,
	marginRight: 12,
	backgroundColor: '#c7d2fe',
	alignItems: 'center',
	justifyContent: 'center',
  },
  avatarFallbackText: {
	fontSize: 18,
	fontWeight: '600',
	color: '#3949ab',
  },
  contactDetails: {
	flex: 1,
  },
  contactName: {
	fontSize: 16,
	fontWeight: '600',
	color: '#1a1a1a',
  },
  contactCompany: {
	fontSize: 14,
	color: '#4a4a4a',
	marginTop: 2,
  },
  contactEmail: {
	fontSize: 13,
	color: '#1a73e8',
	marginTop: 4,
  },
  eventCard: {
	backgroundColor: '#f8fdfd',
	padding: 12,
	borderRadius: 12,
	borderWidth: 1,
	borderColor: '#d2f1ef',
	marginTop: 4,
  },
  eventTitle: {
	fontSize: 16,
	fontWeight: '600',
	color: '#1a1a1a',
	marginBottom: 6,
  },
  eventMetaRow: {
	flexDirection: 'row',
	flexWrap: 'wrap',
	marginBottom: 8,
  },
  eventMeta: {
	fontSize: 14,
	color: '#4a4a4a',
	marginRight: 12,
	marginBottom: 4,
  },
  statusPill: {
	alignSelf: 'flex-start',
	paddingHorizontal: 12,
	paddingVertical: 6,
	borderRadius: 999,
  },
  statusText: {
	fontSize: 12,
	fontWeight: '600',
	color: '#4a4a4a',
  },
});
