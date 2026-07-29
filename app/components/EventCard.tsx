import BookmarkFilledIcon from '@/assets/images/bookmark-filled.svg';
import BookmarkIcon from '@/assets/images/bookmark.svg';
import LocationIcon from '@/assets/images/location.svg';
import VerifiedIcon from '@/assets/images/verified.svg';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, TouchableOpacity, View, type ViewStyle } from 'react-native';

export interface ApiEvent {
  id: number;
  source: string;
  source_event_id: string;
  title: string;
  description: string | null;
  start_datetime: string;
  end_datetime: string | null;
  location_short: string | null;
  location_full: string | null;
  latitude: number | null;
  longitude: number | null;
  host_organization_id: number;
  host_organization_name: string;
  event_url: string | null;
  rsvp_url: string | null;
  image_url: string | null;
  image_aspect_ratio: string | null;
  theme: string | null;
  visibility: string;
  rsvp_total: number;
  save_count: number;
  rsvp_count: number;
  view_count: number;
  org_profile_picture: string | null;
  categories: { id: string; name: string }[];
  // Classifier-assigned taxonomy tags (Phase 2). Rendered as chips.
  tags: string[];
  benefits: string[];
  expires_at: string | null;
  is_featured: number;
  created_by_user_id: number | null;
  is_archived: number;
  archived_at: string | null;
  is_rsvped: boolean;
}

// Formats an ISO datetime as "Fri, 4/29 • 6:00 PM".
export function formatEventDate(isoString: string): string {
  const date = new Date(isoString);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = days[date.getDay()];
  const month = date.getMonth() + 1;
  const dayNum = date.getDate();

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const timeStr =
    minutes === 0
      ? `${hours}:00 ${ampm}`
      : `${hours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

  return `${day}, ${month}/${dayNum} • ${timeStr}`;
}

interface EventCardProps {
  item: ApiEvent;
  isSaved: boolean;
  onToggleSave: (eventId: number) => void;
  style?: ViewStyle;
}

export default function EventCard({ item, isSaved, onToggleSave, style }: EventCardProps) {
  const router = useRouter();
  const hasImage = !!item.image_url;
  const hasBenefits = item.benefits && item.benefits.length > 0;

  const handlePress = () => {
    router.push(`/event/${item.id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[
        {
          width: 172,
          height: 260,
          borderWidth: 1,
          borderColor: '#D2DEE0',
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 2 },
          shadowOpacity: 0.25, // #00000040
          shadowRadius: 4,
          elevation: 4,
        },
        style,
      ]}
      className="mr-4 overflow-hidden rounded-[10px] bg-white"
    >
      <View
        className="overflow-hidden rounded-t-[10px]"
        style={{
          height: 162,
          width: '100%',
          backgroundColor: '#D9D9D9',
        }}
      >
        {hasImage && (
          <Image
            source={{ uri: item.image_url! }}
            resizeMode="cover"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
            }}
          />
        )}

        {hasBenefits && (
          <View
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              backgroundColor: '#BF5700',
              borderRadius: 12,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text
              style={{ fontFamily: 'Roboto-Flex' }}
              className="text-[10px] font-semibold text-white"
            >
              {item.benefits[0]}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            onToggleSave(item.id);
          }}
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
            width: 28,
            height: 28,
            borderRadius: 999,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          {isSaved ? (
            <BookmarkFilledIcon width={10} height={14} />
          ) : (
            <BookmarkIcon width={10} height={14} />
          )}
        </TouchableOpacity>
      </View>

      <View className="flex-1 rounded-b-[10px] px-[9px] pt-[12px] pb-[9px]">
        <Text
          numberOfLines={1}
          style={{ fontFamily: 'Roboto-Flex' }}
          className="mb-[4px] text-[16px] font-semibold text-[#020B12]"
        >
          {item.title}
        </Text>

        <View className="mb-[4px] flex-row items-center">
          {item.org_profile_picture && (
            <Image
              source={{ uri: item.org_profile_picture }}
              style={{
                width: 14,
                height: 14,
                borderRadius: 7,
                marginRight: 4,
              }}
            />
          )}

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{ fontFamily: 'Roboto-Flex' }}
            className="flex-1 text-[12px] font-normal text-[#020B12]"
          >
            {item.host_organization_name}
          </Text>

          <VerifiedIcon
            width={19}
            height={19}
            style={{ marginLeft: 2, flexShrink: 0 }}
          />
        </View>

        <Text
          style={{ fontFamily: 'Roboto-Flex' }}
          className="mb-[4px] text-[12px] font-normal text-[#81868A]"
        >
          {formatEventDate(item.start_datetime)}
        </Text>

        <View className="flex-row items-center">
          <LocationIcon width={14} height={14} />

          <Text
            numberOfLines={1}
            style={{ fontFamily: 'Roboto-Flex' }}
            className="ml-[4px] flex-1 text-[12px] font-normal text-[#81868A]"
          >
            {item.location_short || 'TBD'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}