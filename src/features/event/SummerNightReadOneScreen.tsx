import { useState, useEffect } from "react";
import { View, Text, Image, Pressable, ScrollView } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import moviesData from "../../../assets/movies.json";
import eventsData from "../../../assets/summer-night-events.json";

const STORAGE_KEY = "@festival_planning";

type Movie = {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  original_release_date?: string;
  duration?: string;
  directors?: string[];
  main_cast?: string[];
  genres?: string[];
  versions?: string[];
};

type SummerNightEvent = {
  id: number;
  movie_id: number;
  place: string;
  target_audience?: string;
  screening_datetime: string;
  practical_info?: string[];
  accessibility?: string[];
};

function formatDateBadge(iso: string) {
  const d = new Date(iso);
  const dateLabel = d.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "long",
  });
  const timeLabel = d.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateLabel} · ${timeLabel.replace(":", "h")}`;
}

function yearFromIso(iso: string) {
  return String(new Date(iso).getFullYear());
}

export function SummerNightReadOneScreen() {
  const params = useLocalSearchParams();
  const eventId = params.eventId as string;
  
  const [addedToPlanning, setAddedToPlanning] = useState(false);

  useEffect(() => {
    checkIfInPlanning();
  }, [eventId]);

  const checkIfInPlanning = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const planning = new Set(JSON.parse(stored));
        const eventKey = `summer:${eventId}`;
        setAddedToPlanning(planning.has(eventKey));
      }
    } catch (error) {
      console.error("Erreur lecture planning:", error);
    }
  };

  const togglePlanning = async () => {
    try {
      const eventKey = `summer:${eventId}`;
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const planning = stored ? new Set(JSON.parse(stored)) : new Set<string>();

      if (planning.has(eventKey)) {
        planning.delete(eventKey);
        setAddedToPlanning(false);
      } else {
        planning.add(eventKey);
        setAddedToPlanning(true);
      }

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(Array.from(planning))
      );
    } catch (error) {
      console.error("Erreur sauvegarde planning:", error);
    }
  };

  const events: SummerNightEvent[] = (eventsData as any).summer_night_events;
  const movies: Movie[] = (moviesData as any).movies;

  const eventIdNum = eventId ? Number(eventId) : NaN;
  const event = events.find((e) => e.id === eventIdNum) ?? events[0];
  const movie = movies.find((m) => m.id === event.movie_id);

  const imageUrl = movie?.image_url;
  const badgeLabel = formatDateBadge(event.screening_datetime);
  const title = `Projection plein air : "${movie?.name ?? "Film"}"`;
  const place = event.place;
  const audience = event.target_audience ?? "Tout public";

  const synopsis =
    movie?.description ??
    "Synopsis à venir. Revenez bientôt pour découvrir plus d'informations sur ce film.";

  const practical =
    event.practical_info?.length
      ? event.practical_info
      : [
          "Ouverture des portes 30 min avant",
          "Prévoir une veste / couverture",
          "Buvette sur place",
        ];

  const accessibility =
    event.accessibility?.length
      ? event.accessibility
      : [
          "Accès PMR",
          "Zone réservée aux fauteuils roulants",
          "Toilettes accessibles",
        ];

  const releaseYear = yearFromIso(event.screening_datetime);
  const duration = movie?.duration ?? "—";
  const directors = movie?.directors?.length ? movie.directors.join(", ") : "—";
  const cast = movie?.main_cast?.length ? movie.main_cast.join(", ") : "—";
  const genres = movie?.genres?.length ? movie.genres.join(", ") : "—";
  const versions = movie?.versions?.length ? movie.versions.join(" · ") : "—";

  // Vérifier si l'événement est futur
  const isFutureEvent = new Date(event.screening_datetime).getTime() > Date.now();

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* HEADER */}
      <View style={tw`px-4 pt-4 pb-2`}>
        <View style={tw`flex-row items-center`}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) =>
              tw`w-10 h-10 rounded-full items-center justify-center ${
                pressed ? "bg-slate-100" : "bg-transparent"
              }`
            }
          >
            <Ionicons name="chevron-back" size={22} color="#0f172a" />
          </Pressable>

          <View style={tw`ml-2`}>
            <Text style={tw`text-base font-bold text-slate-900`}>
              Cinéma en plein air
            </Text>
            <Text style={tw`text-slate-500 text-xs`}>Évènement</Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={tw`flex-1`}
        contentContainerStyle={tw`pb-24`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`px-4 pt-3`}>
          {/* HERO */}
          <View style={tw`rounded-2xl overflow-hidden`}>
            {imageUrl ? (
              <Image
                source={{ uri: imageUrl }}
                style={tw`w-full h-48`}
                resizeMode="cover"
              />
            ) : (
              <View style={tw`w-full h-48 bg-slate-200`} />
            )}
          </View>

          {/* Badge date */}
          <View
            style={tw`mt-3 self-start bg-orange-100 px-3 py-2 rounded-lg border border-orange-200`}
          >
            <Text style={tw`text-orange-700 font-semibold text-xs`}>
              {badgeLabel}
            </Text>
          </View>

          {/* Title */}
          <Text style={tw`mt-4 text-slate-900 font-extrabold text-lg`}>
            {title}
          </Text>

          {/* Lieu */}
          <View style={tw`mt-3 flex-row items-center`}>
            <Ionicons name="location-outline" size={16} color="#64748b" />
            <Text style={tw`ml-2 text-slate-500 text-sm`}>{place}</Text>
          </View>

          {/* Public */}
          <View style={tw`mt-2 flex-row items-center`}>
            <Ionicons name="people-outline" size={16} color="#64748b" />
            <Text style={tw`ml-2 text-slate-500 text-sm`}>{audience}</Text>
          </View>

          {/* Button - Nouveau style */}
          {isFutureEvent && (
            <View style={tw`mt-6`}>
              <Pressable
                onPress={togglePlanning}
                style={({ pressed }) =>
                  tw`w-full py-3.5 rounded-xl flex-row items-center justify-center ${
                    addedToPlanning
                      ? pressed
                        ? "bg-slate-700"
                        : "bg-slate-800"
                      : pressed
                      ? "bg-orange-600"
                      : "bg-orange-500"
                  }`
                }
              >
                <Ionicons
                  name={addedToPlanning ? "checkmark-circle" : "add-circle"}
                  size={22}
                  color="white"
                />
                <Text style={tw`ml-2 text-white font-bold text-base`}>
                  {addedToPlanning ? "Dans mon planning" : "Ajouter au planning"}
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* SYNOPSIS */}
        <View style={tw`mt-6`}>
          <Text style={tw`px-4 text-slate-900 font-extrabold tracking-wider text-xs`}>
            SYNOPSIS
          </Text>
          <View style={tw`mt-3 h-px bg-slate-100`} />
          <View style={tw`px-4 pt-4`}>
            <Text style={tw`text-slate-700 leading-5`}>{synopsis}</Text>
          </View>
        </View>

        {/* FICHE TECHNIQUE */}
        <View style={tw`mt-6`}>
          <Text style={tw`px-4 text-slate-900 font-extrabold tracking-wider text-xs`}>
            FICHE TECHNIQUE
          </Text>
          <View style={tw`mt-3 h-px bg-slate-100`} />

          <View style={tw`px-4 pt-4`}>
            <View style={tw`flex-row items-center`}>
              <Ionicons name="calendar-outline" size={14} color="#64748b" />
              <Text style={tw`ml-2 text-slate-600 text-xs`}>{releaseYear}</Text>
            </View>

            <View style={tw`mt-2 flex-row items-center`}>
              <Ionicons name="time-outline" size={14} color="#64748b" />
              <Text style={tw`ml-2 text-slate-600 text-xs`}>{duration}</Text>
            </View>

            <View style={tw`mt-2 flex-row items-center`}>
              <Ionicons name="person-outline" size={14} color="#64748b" />
              <Text style={tw`ml-2 text-slate-600 text-xs`}>
                Réalisation : {directors}
              </Text>
            </View>

            <View style={tw`mt-2 flex-row items-center`}>
              <Ionicons name="people-outline" size={14} color="#64748b" />
              <Text style={tw`ml-2 text-slate-600 text-xs`}>Avec : {cast}</Text>
            </View>

            <View style={tw`mt-2 flex-row items-center`}>
              <Ionicons name="pricetag-outline" size={14} color="#64748b" />
              <Text style={tw`ml-2 text-slate-600 text-xs`}>
                Genre : {genres}
              </Text>
            </View>

            <View style={tw`mt-2 flex-row items-center`}>
              <Ionicons name="film-outline" size={14} color="#64748b" />
              <Text style={tw`ml-2 text-slate-600 text-xs`}>
                Versions : {versions}
              </Text>
            </View>
          </View>
        </View>

        {/* INFOS PRATIQUES */}
        <View style={tw`mt-6`}>
          <Text style={tw`px-4 text-slate-900 font-extrabold tracking-wider text-xs`}>
            INFOS PRATIQUES
          </Text>
          <View style={tw`mt-3 h-px bg-slate-100`} />

          <View style={tw`px-4 pt-4`}>
            {practical.map((line, idx) => (
              <View key={idx} style={tw`flex-row items-start mt-2`}>
                <View style={tw`mt-1 mr-2 w-2 h-2 rounded-full bg-slate-300`} />
                <Text style={tw`text-slate-700 flex-1`}>{line}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ACCESSIBILITÉ */}
        <View style={tw`mt-6`}>
          <Text style={tw`px-4 text-slate-900 font-extrabold tracking-wider text-xs`}>
            ACCESSIBILITÉ
          </Text>
          <View style={tw`mt-3 h-px bg-slate-100`} />

          <View style={tw`px-4 pt-4`}>
            {accessibility.map((line, idx) => (
              <View key={idx} style={tw`flex-row items-start mt-2`}>
                <View style={tw`mt-1 mr-2 w-2 h-2 rounded-full bg-slate-300`} />
                <Text style={tw`text-slate-700 flex-1`}>{line}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}