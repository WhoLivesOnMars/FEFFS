import { Image, ScrollView, View } from "react-native";
import { Component } from "react";
import tw from "twrnc";

import { EventsOfTheYearSection } from "@/src/features/home/sections/EventsOfTheYearSection";
import { NewsSection } from "@/src/features/home/sections/NewsSection";
import { InformationSection } from "@/src/features/home/sections/InformationSection";

import { BottomNavBar } from "@/src/components/navigation/BottomNavBar";

export class HomeScreen extends Component {
  render() {
    return (
      <View style={tw`flex-1 bg-white`}>
        <ScrollView contentContainerStyle={tw`pb-28`} showsVerticalScrollIndicator>
          <View style={tw`w-full h-64 rounded-b-lg overflow-hidden`}>
            <Image
              style={tw`w-full h-full`}
              source={{ uri: "https://picsum.photos/1920/1080" }}
              resizeMode="cover"
            />
          </View>

          <EventsOfTheYearSection />
          <NewsSection />
          <InformationSection />
        </ScrollView>


        <BottomNavBar />
      </View>
    );
  }
}
