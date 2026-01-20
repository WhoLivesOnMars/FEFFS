import React from "react";
import { useLocalSearchParams } from "expo-router";
import { SummerNightReadOneScreen } from "../../../src/features/event/SummerNightReadOneScreen";

export default function SummerNightDetailRoute() {
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();

  return <SummerNightReadOneScreen eventId={eventId} />;
}
