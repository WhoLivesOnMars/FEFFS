import { Component } from "react";
import { View, Text, Image, Pressable, ScrollView, FlatList } from "react-native";
import tw from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { EventListHeader } from "@/src/components/event/EventListHeader";
import { YearChips } from "@/src/components/event/YearChips";
import { BottomNavBar } from "@/src/components/navigation/BottomNavBar";

type Award = {
  id: number;
  title: string;
  category: string;
  movieName: string;
  director: string;
  imageUrl?: string;
  year: number;
};

type YearSection = {
  year: number;
  longFilms: Award[];
  shortFilms: Award[];
};

type State = {
  selectedYear: number;
};

export class WinnersScreen extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      selectedYear: 2025,
    };
  }

  private YEARS = [2025, 2024, 2023, 2022, 2021, 2020];

  // Données mockées - À remplacer par tes vraies données JSON
  private getData(): YearSection[] {
    return [
      {
        year: 2025,
        longFilms: [
          {
            id: 1,
            title: "Octopus d'or du meilleur long métrage international",
            category: "Long métrage",
            movieName: "L'Écho des Abysses (France)",
            director: "de Sarah M. Chen",
            imageUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800",
            year: 2025,
          },
          {
            id: 2,
            title: "Prix du jury - Long métrage",
            category: "Long métrage",
            movieName: "Nuit Blanche (Belgique)",
            director: "de Marc Dubois",
            imageUrl: "https://images.unsplash.com/photo-1574267432644-f610bc8c6757?w=800",
            year: 2025,
          },
          {
            id: 3,
            title: "Prix du public - Long métrage",
            category: "Long métrage",
            movieName: "Le Dernier Refuge (Canada)",
            director: "de Emma Rodriguez",
            imageUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
            year: 2025,
          },
        ],
        shortFilms: [
          {
            id: 4,
            title: "Octopus d'or du meilleur court métrage",
            category: "Court métrage",
            movieName: "Silence (Suisse)",
            director: "de Lucas Weber",
            imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800",
            year: 2025,
          },
          {
            id: 5,
            title: "Prix du jury - Court métrage",
            category: "Court métrage",
            movieName: "Entre Deux Mondes (France)",
            director: "de Claire Martin",
            imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800",
            year: 2025,
          },
          {
            id: 6,
            title: "Prix spécial du jury",
            category: "Court métrage",
            movieName: "Les Ombres (Allemagne)",
            director: "de Hans Schmidt",
            imageUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800",
            year: 2025,
          },
        ],
      },
      {
        year: 2024,
        longFilms: [
          {
            id: 7,
            title: "Octopus d'or du meilleur long métrage international",
            category: "Long métrage",
            movieName: "Horizons Perdus (Italie)",
            director: "de Giovanni Rossi",
            imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
            year: 2024,
          },
        ],
        shortFilms: [
          {
            id: 8,
            title: "Octopus d'or du meilleur court métrage",
            category: "Court métrage",
            movieName: "Fragments (Espagne)",
            director: "de Maria Garcia",
            imageUrl: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800",
            year: 2024,
          },
        ],
      },
    ];
  }

  private renderAwardCard = (award: Award) => {
    return (
      <Pressable
        key={award.id}
        onPress={() => {
          // Navigation vers la page du film
        }}
        style={({ pressed }) =>
          tw`w-44 mr-3 ${pressed ? "opacity-90" : "opacity-100"}`
        }
      >
        {/* Image avec badge */}
        <View style={tw`relative`}>
          <View style={tw`w-44 h-64 rounded-2xl overflow-hidden bg-slate-800`}>
            {award.imageUrl ? (
              <Image
                source={{ uri: award.imageUrl }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            ) : null}
          </View>

          {/* Badge Octopus d'or */}
          <View style={tw`absolute top-2 left-2 bg-amber-500 px-2 py-1 rounded-lg flex-row items-center`}>
            <Ionicons name="trophy" size={12} color="#000" />
            <Text style={tw`ml-1 text-black text-[10px] font-bold`}>
              Octopus d'or
            </Text>
          </View>
        </View>

        {/* Infos - Texte blanc sur fond noir */}
        <View style={tw`mt-2`}>
          <Text style={tw`text-white font-bold text-sm leading-4`} numberOfLines={2}>
            {award.title}
          </Text>
          <Text style={tw`mt-1 text-slate-300 text-xs`} numberOfLines={1}>
            {award.movieName}
          </Text>
          <Text style={tw`text-slate-400 text-xs`} numberOfLines={1}>
            {award.director}
          </Text>
        </View>
      </Pressable>
    );
  };

  render() {
    const data = this.getData();
    const yearData = data.find((y) => y.year === this.state.selectedYear) ?? data[0];

    return (
      <View style={tw`flex-1 bg-white`}>
        {/* Header avec composant réutilisable */}
        <EventListHeader
          title="Palmarès"
          subtitle="Programmation & archives"
          onBack={() => router.back()}
        />

        <ScrollView
          style={tw`flex-1`}
          contentContainerStyle={tw`pb-20`}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Banner */}
          <View style={tw`mt-2 px-4`}>
            <View style={tw`w-full h-48 rounded-2xl overflow-hidden bg-slate-900`}>
              <Image
                source={{
                  uri: "https://strasbourgfestival.com/wp-content/uploads/2024/06/CPA2025_banner_700x370.png",
                }}
                style={tw`w-full h-full`}
                resizeMode="cover"
              />
            </View>
          </View>

          {/* Year Filter avec composant réutilisable */}
          <View style={tw`mt-4 px-4`}>
            <Text style={tw`text-slate-900 font-extrabold tracking-wider text-xs`}>
              ANNÉE
            </Text>

            <View style={tw`mt-3`}>
              <YearChips
                years={this.YEARS}
                selectedYear={this.state.selectedYear}
                onSelectYear={(year) => this.setState({ selectedYear: year })}
              />
            </View>
          </View>

          {/* Section sombre avec les prix */}
          <View style={tw`mt-6 bg-black pt-6 pb-10`}>
            {/* LONGS MÉTRAGES */}
            <View>
              <Text style={tw`px-4 text-white font-extrabold tracking-wider text-xs`}>
                LONGS MÉTRAGES
              </Text>

              <FlatList
                data={yearData.longFilms}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={tw`px-4 mt-3`}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => this.renderAwardCard(item)}
              />
            </View>

            {/* COURTS MÉTRAGES */}
            <View style={tw`mt-6`}>
              <Text style={tw`px-4 text-white font-extrabold tracking-wider text-xs`}>
                COURTS MÉTRAGES
              </Text>

              <FlatList
                data={yearData.shortFilms}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={tw`px-4 mt-3`}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item }) => this.renderAwardCard(item)}
              />
            </View>
          </View>
        </ScrollView>
        <BottomNavBar />
      </View>
    );
  }
}